// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Bypass auth pour le développement
  return <Redirect href="/(app)/(tabs)" />;
}