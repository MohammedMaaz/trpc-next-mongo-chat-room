import axios from "axios";

export function uploadFileToUrl({
  file,
  url,
  method = "PUT",
}: {
  file: File;
  url: string;
  method?: "PUT" | "POST";
}) {
  return axios.request({
    url,
    method,
    data: file,
    headers: { "Content-Type": file.type },
  });
}
