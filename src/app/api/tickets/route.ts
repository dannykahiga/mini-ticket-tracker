import {NextRequest, NextResponse} from 'next/server'
import axios from "axios";
import {API_DOMAIN} from "@/app/lib/constants";
let apiEndpoint: string = "";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const {payload, url, method} = await req.json();
    apiEndpoint = `${API_DOMAIN}${url}`;

    const responseData = await doRequest(payload, method);

    return NextResponse.json(responseData);
}

const doRequest = async (payload: unknown, method: string) => {
    try {
        console.log("payload", payload);
        console.log("Endpoint", apiEndpoint);
        const config = {
            method: method,
            maxBodyLength: Infinity,
            url: apiEndpoint,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(payload),
        };
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error;
    }
};