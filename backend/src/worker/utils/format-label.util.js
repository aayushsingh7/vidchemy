function formatLabels({labels, productTimestamps, lookbackMs = 200, lookaheadMs = 200}) {
    labels.sort((a, b) => a.Timestamp - b.Timestamp);

    const formattedResults = [];

    for (const targetTime of productTimestamps) {
        const minTime = targetTime - lookbackMs;
        const maxTime = targetTime + lookaheadMs;

        // Binary search to find the FIRST index where Timestamp >= minTime
        let left = 0;
        let right = labels.length - 1;
        let startIndex = -1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (labels[mid].Timestamp >= minTime) {
                startIndex = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        let bestInstanceMatch = null;
        let bestLabelOnlyMatch = null;
        let highestInstanceScore = -1;
        let highestLabelOnlyScore = -1;

        if (startIndex !== -1) {
            for (let i = startIndex; i < labels.length; i++) {
                const currentData = labels[i];

                if (currentData.Timestamp > maxTime) {
                    break;
                }

                const labelInfo = currentData.Label;
                const hasInstances = labelInfo.Instances && labelInfo.Instances.length > 0;

                if (!hasInstances) {
                    // Track best label-only match as fallback (no bounding box)
                    if (labelInfo.Confidence > highestLabelOnlyScore) {
                        highestLabelOnlyScore = labelInfo.Confidence;
                        bestLabelOnlyMatch = {
                            rekognitionTimestamp: currentData.Timestamp,
                            name: labelInfo.Name,
                            labelConfidence: labelInfo.Confidence,
                            instanceConfidence: null,
                            boundingBox: null,
                            parents: labelInfo.Parents?.map(p => p.Name) || [],
                            categories: labelInfo.Categories?.map(c => c.Name) || []
                        };
                    }
                    continue;
                }

                // Find the highest confidence instance for this label
                let bestInstance = labelInfo.Instances[0];
                for (let j = 1; j < labelInfo.Instances.length; j++) {
                    if (labelInfo.Instances[j].Confidence > bestInstance.Confidence) {
                        bestInstance = labelInfo.Instances[j];
                    }
                }

                const currentScore = labelInfo.Confidence + bestInstance.Confidence;

                if (currentScore > highestInstanceScore) {
                    highestInstanceScore = currentScore;
                    bestInstanceMatch = {
                        rekognitionTimestamp: currentData.Timestamp,
                        name: labelInfo.Name,
                        labelConfidence: labelInfo.Confidence,
                        instanceConfidence: bestInstance.Confidence,
                        boundingBox: bestInstance.BoundingBox,
                        parents: labelInfo.Parents?.map(p => p.Name) || [],
                        categories: labelInfo.Categories?.map(c => c.Name) || []
                    };
                }
            }
        }

        // Prefer a match with a bounding box, fall back to label-only
        const bestMatch = bestInstanceMatch ?? bestLabelOnlyMatch;

        formattedResults.push({
            targetTimestamp: targetTime,
            hasMatch: bestMatch !== null,
            hasBoundingBox: bestMatch?.boundingBox !== null && bestMatch?.boundingBox !== undefined,
            bestLabel: bestMatch
        });
    }

    return formattedResults;
}

export default formatLabels;