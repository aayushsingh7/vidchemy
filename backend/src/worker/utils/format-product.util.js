export function formatReferenceProduct(data, index) {
    const formatList = (arr) => (arr && arr.length > 0 ? arr.map((item) => `- ${item}`).join("\n") : "- N/A");
    const formatSpecs = (specs) =>
        specs && specs.length > 0 ? specs.map((spec) => `- **${spec.key}**: ${spec.value}`).join("\n") : "- N/A";

    const breadcrumbsStr = data.breadcrumbs ? data.breadcrumbs.join(", ") : "N/A";
    const priceStr = data.price?.currentPrice ? `${data.price.symbol}${data.price.currentPrice}` : "N/A";
    const originalPriceStr = data.price?.beforePrice ? `${data.price.symbol}${data.price.beforePrice}` : "N/A";
    const discountStr = data.price?.discount ? `(${data.price.discount} Off)` : "";

    const positiveAspects =
        data.reviewsInfo?.aspects
        ?.filter((a) => a.status === "positive")
        ?.map((a) => a.aspect)
        .join(", ") || "None highlighted";

    const mixedAspects =
        data.reviewsInfo?.aspects
        ?.filter((a) => a.status === "mixed")
        ?.map((a) => a.aspect)
        .join(", ") || "None highlighted";

    return `### PRODUCT ${index} METADATA
- **Title**: ${data.title || "N/A"}
- **Brand**: ${data.brand || "N/A"}
- **ASIN**: ${data.asin || "N/A"}
- **Price**: ${priceStr} | Original: ${originalPriceStr} ${discountStr}
- **Availability**: ${data.isAvailable ? "In Stock" : "Out of Stock"}

#### 📂 CATEGORIES & BREADCRUMBS
> ${breadcrumbsStr}

#### 🎯 KEY FEATURES (A9 SEO BULLETS)
${formatList(data.featureBullets)}

#### ⚙️ TECHNICAL SPECIFICATIONS
${formatSpecs(data.specification)}

#### 📦 IN THE BOX
${formatList(data.whatIsInTheBox)}

#### 🗣️ CUSTOMER SENTIMENT & REVIEWS
- **Overall Rating**: ${data.reviewsInfo?.rating || "N/A"} / 5.0 (${data.reviewsInfo?.totalReviews || 0} reviews)
- **Top Positive Aspects**: ${positiveAspects}
- **Mixed/Improvement Aspects**: ${mixedAspects}
- **AI Review Consensus**: ${data.reviewsInfo?.customersSay || "N/A"}`;
}

export function formatOriginalProduct(data) {
    const formatList = (arr) => (arr && arr.length > 0 ? arr.map((item) => `- ${item}`).join("\n") : "- N/A");
    const formatSpecs = (specs) =>
        specs && specs.length > 0
            ? specs.map((spec) => `- **${spec.attribute_name}**: ${spec.attribute_value}`).join("\n")
            : "- N/A";

    return `### TARGET PRODUCT (RAW BASELINE DATA)
- **Name**: ${data.product_name || "N/A"}
- **Brand**: ${data.brand || "N/A"}
- **Model**: ${data.model_or_style_code || "N/A"}
- **Category**: ${data.category || "N/A"}
- **Current Price**: ${data.price?.currency || ""} ${data.price?.current_price || "N/A"}
- **Original Price**: ${data.price?.currency || ""} ${data.price?.original_price || "N/A"}

#### 📝 BASE DESCRIPTION
> ${data.description || "N/A"}

#### 🎯 BASE KEY FEATURES
${formatList(data.key_features)}

#### ⚙️ BASE SPECIFICATIONS
${formatSpecs(data.specifications)}

#### 📦 PHYSICAL & CARE DETAILS
- **Weight**: ${data.physical_details?.weight || "N/A"}
- **Material**: ${data.physical_details?.primary_material || "N/A"}
- **Care**: ${data.care_instructions || "N/A"}
- **Warranty**: ${data.warranty_or_guarantee || "N/A"}
\n`;
}

