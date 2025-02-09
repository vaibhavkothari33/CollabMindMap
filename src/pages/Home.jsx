import LoginButton from "../Components/LoginButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to MindMap Collab</h1>
      <LoginButton />
    </div>
  );
}