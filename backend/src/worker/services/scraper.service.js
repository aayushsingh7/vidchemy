import CustomError from "../../shared/utils/custom-error.util.js";

class ScraperService {
    #awsService;
    constructor(awsService) {
        this.#awsService = awsService;
    }
    async searchAmazonProducts({query, domain = "www.amazon.in", sortBy}) {
        let URL = `${process.env.HAS_DATA_API_URL}/search?q=${encodeURIComponent(query)}&domain=${domain}&page=1`;
        if (sortBy) URL += `&sortBy=${encodeURIComponent(sortBy)}`;
        try {
            if (!query) throw new CustomError("Query is required", 400);
            const results = await fetch(URL, {
                headers: {
                    "x-api-key": process.env.HAS_DATA_API_KEY,
                    "Content-Type": "application/json",
                },
            });

            const res = await results.json();
            console.log("AmazonScraperService.search(): ", res);
            return res.productResults;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async fetchAmazonProductById({asin, domain = "www.amazon.in"}) {
        try {
            if (!asin) throw new CustomError("ASIN is required", 400);
            const results = await fetch(`${process.env.HAS_DATA_API_URL}/product?asin=${asin}&domain=${domain}`, {
                headers: {
                    "x-api-key": process.env.HAS_DATA_API_KEY,
                    "Content-Type": "application/json",
                },
            });

            const res = await results.json();
            console.log("AmazonScraperService.getByAsin(): ", res);
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async fetchAmazonProductBatched({searchResults, batchSize = 3}) {
        const results = [];
        for (let i = 0; i < searchResults.length; i += batchSize) {
            const batch = searchResults.slice(i, i + batchSize);
            const batchPromise = batch.map((data, index) => {
                return this.fetchAmazonProductById({asin: data.asin}).catch((err) => {
                    console.log("Error at fetching product details: asin", data.asin, err.message);
                    return null;
                });
            });
            const batchResults = await Promise.all(batchPromise);
            results.push(...batchResults.filter(Boolean));
        }

        return results;
    }

    async fetchInstagramReel(url) {
        const API_URL = `https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${url}`;
        const options = {
            method: "GET",
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY,
                "x-rapidapi-host": process.env.RAPID_API_INSTAGRAM_HOST,
            },
        };

        try {
            const response = await fetch(API_URL, options);
            const result = await response.json();
            const postData = result.data;
            const medias = postData.medias;
            if (!medias.length) throw new CustomError("Cannot donwload the video");
            const donwloadURL = medias[0].url;
            const streamResponse = await fetch(donwloadURL);
            const s3Key = this.#awsService.generateKey("videos");
            await this.#awsService.uploadStream({
                key: s3Key,
                stream: streamResponse.body,
                contentType: "video/mp4",
            });

            return {
                s3Key: s3Key,
                title: postData.title,
                description: postData.description || "",
            };
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

export default ScraperService;
