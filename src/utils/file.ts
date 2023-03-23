import axios, { AxiosResponse } from "axios";

export function uploadFileToUrl({
  file,
  url,
  method = "PUT",
}: {
  file: File;
  url: string;
  method?: "PUT" | "POST";
}): Promise<AxiosResponse<void>> {
  return axios.request<void>({
    url,
    method,
    data: file,
    headers: { "Content-Type": file.type },
  });
}
