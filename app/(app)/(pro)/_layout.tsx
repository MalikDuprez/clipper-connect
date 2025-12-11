// app/(app)/(pro)/_layout.tsx
import { Stack } from "expo-router";
import { useAuthStore } from "@stores/authStore";
import { Redirect } from "expo-router";

export default function ProLayout() {
  const { user, isLoading } = useAuthStore();

  // Vérifie que l'utilisateur est coiffeur ou salon
  const isPro = user?.role === "coiffeur" || user?.role === "salon";

  if (!isLoading && !isPro) {
    // Pas un pro → retour à l'accueil
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="agenda" />
      <Stack.Screen name="clients" />
      <Stack.Screen name="earnings" />
      <Stack.Screen name="services/index" />
      <Stack.Screen name="services/[id]" />
      <Stack.Screen name="portfolio/index" />
      <Stack.Screen name="portfolio/add" />
      <Stack.Screen name="settings-pro" />
    </Stack>
  );
}
