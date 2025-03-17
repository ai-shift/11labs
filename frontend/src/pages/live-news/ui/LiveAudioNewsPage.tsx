import { useUserInfoStore } from "features/user-info";
import { useNavigate } from "react-router-dom";
import MainActions from "./components/MainActions";

export function LiveAudioNewsPage() {
  const { userData } = useUserInfoStore();
  const navigate = useNavigate();

  if (userData == null) {
    navigate("/interview");
  }

  return (
    <main className="min-h-screen flex">
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Welcome back, {userData.name}!
            </h1>
            <p className="text-gray-600">
              Your personalized audio digest is ready.
            </p>
          </div>
          <MainActions />
        </div>
      </div>
    </main>
  );
}
