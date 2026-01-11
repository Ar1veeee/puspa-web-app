/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export async function resetPassword({
  token,
  email,
  password,
  password_confirmation,
}: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  try {
    const res = await axios.post(
      `https://puspa.sinus.ac.id/api/v1/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`,
      { password, password_confirmation },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      success: true,
      message: res.data?.message || "Password berhasil diubah.",
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data;

      console.error("❌ Reset password error:", status, data);

      if (status === 422) {
        const errors = (data as any)?.errors;
        const firstError =
          errors?.password?.[0] ||
          errors?.password_confirmation?.[0] ||
          "Validasi gagal.";
        throw new Error(firstError);
      }

      if (status === 400 || status === 401) {
        throw new Error((data as any)?.message || "Token reset tidak valid atau sudah kadaluarsa.");
      }

      throw new Error((data as any)?.message || "Gagal mengubah password.");
    }

    throw new Error("Tidak dapat terhubung ke server.");
  }
}
