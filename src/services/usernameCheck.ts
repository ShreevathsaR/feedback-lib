import { ApiResponse } from "@/types/apiResponse"
import axios from "axios"

export const usernameCheck = async (username: string): Promise<ApiResponse> => {
        const response = await axios.get(`/api/username-check?username=${username}`)
        return response.data
}