import CustomError from "../../shared/utils/custom-error.util.js";
import limit from "p-limit";

const apiLimit = limit(1);

class ScraperService {
    #awsService;
    constructor(awsService) {
        this.#awsService = awsService;
    }

    async #fetchAmazonProductById({asin, domain = "www.amazon.in"}) {
        if (!asin) throw new CustomError("ASIN is required", 400);

        const results = await fetch(`${process.env.HAS_DATA_API_URL}/product?asin=${asin}&domain=${domain}`, {
            headers: {
                "x-api-key": process.env.HAS_DATA_API_KEY,
                "Content-Type": "application/json",
            },
        });

        const res = await results.json();
        return res.product;
    }

    async searchAmazonProducts({query, domain = "www.amazon.in", sortBy}) {
        return apiLimit(async () => {
            if (!query) throw new CustomError("Query is required", 400);

            let URL = `${process.env.HAS_DATA_API_URL}/search?q=${encodeURIComponent(query)}&domain=${domain}&page=1`;
            if (sortBy) URL += `&sortBy=${encodeURIComponent(sortBy)}`;

            const results = await fetch(URL, {
                headers: {
                    "x-api-key": process.env.HAS_DATA_API_KEY,
                    "Content-Type": "application/json",
                },
            });

            const res = await results.json();
            return res.productResults;
        });
    }

    async fetchAmazonProducts({searchResults}) {
        const promises = searchResults.map((data) =>
            apiLimit(() =>
                this.#fetchAmazonProductById({asin: data.asin}).catch((err) => {
                    console.log("Error at fetching product details: asin", data.asin, err.message);
                    return null;
                })
            )
        );

        const results = await Promise.all(promises);
        return results.filter(Boolean);
    }

    async fetchInstagramReel(url) {
        return apiLimit(async () => {
            const API_URL = `https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${url}`;

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": process.env.RAPID_API_KEY,
                    "x-rapidapi-host": process.env.RAPID_API_INSTAGRAM_HOST,
                },
            });

            const result = await response.json();
            if (!result || !result.data) {
                throw new CustomError("Unable to retrieve Instagram reel data, try again");
            }
            const postData = result.data;
            const medias = postData.medias;
            if (!medias.length) throw new CustomError("Cannot download the video");

            const downloadURL = medias[0].url;
            const streamResponse = await fetch(downloadURL);

            const s3Key = this.#awsService.generateKey("videos");

            await this.#awsService.uploadStream({
                key: s3Key,
                stream: streamResponse.body,
                contentType: "video/mp4",
            });

            return {
                s3Key,
                title: postData.title,
                description: postData.description || "",
            };
        });
    }
}

export default ScraperService;
