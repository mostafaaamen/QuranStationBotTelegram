import axios from 'axios';
import FormData from 'form-data';

export async function publishPhotoPost(imageBuffer, captionMessage) {
  const pageId = "111374497711676";
  const accessToken = process.env.ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("ACCESS_TOKEN is missing in .env");
  }

  const formData = new FormData();
  formData.append("source", imageBuffer, { filename: "post_card.png" });
  formData.append("caption", captionMessage);

  const response = await axios.post(
    `https://graph.facebook.com/v25.0/${pageId}/photos`,
    formData,
    {
      params: { access_token: accessToken },
      headers: { ...formData.getHeaders() }
    }
  );

  console.log("تم نشر الصورة بنجاح على فيسبوك! Post ID:", response.data.id);
  return response.data;
}