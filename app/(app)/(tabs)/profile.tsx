// app/(app)/(tabs)/profile.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Pressable, 
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { useScrollContext } from "./_layout";
import { useAuthStore } from "@stores/authStore";
import { useBookingStore } from "@stores/bookingStore";

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#E5E5E5",
  card: "#F5F5F5",
  info: "#1976D2",
  error: "#E53935",
  errorLight: "#FFEBEE",
};

// Données mock pour les stats (à remplacer par les vraies données plus tard)
const MOCK_STATS = {
  favorites: 12,
  appointments: 8,
  rating: 4.9,
};

const FAVORITES_MENU = [
  { 
    icon: "cut-outline", 
    label: "Coiffeurs favoris", 
    count: 5,
    route: "/(shared)/favorites/coiffeurs",
  },
  { 
    icon: "storefront-outline", 
    label: "Salons favoris", 
    count: 3,
    route: "/(shared)/favorites/salons",
  },
  { 
    icon: "bookmark-outline", 
    label: "Inspirations sauvegardées", 
    count: 24,
    route: "/(shared)/favorites/inspirations",
  },
];

const ACCOUNT_MENU = [
  { 
    icon: "person-outline", 
    label: "Informations personnelles",
    route: "/(shared)/account/personal-info",
  },
  { 
    icon: "card-outline", 
    label: "Moyens de paiement",
    route: "/(shared)/account/payment-methods",
  },
  { 
    icon: "location-outline", 
    label: "Adresses enregistrées",
    route: "/(shared)/account/addresses",
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setIsScrolling } = useScrollContext();
  
  // Auth store
  const { user, signOut } = useAuthStore();
  
  // Booking store pour les stats
  const { bookings } = useBookingStore();
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const isGoingDown = currentY > lastScrollY.current;
    const isGoingUp = currentY < lastScrollY.current;
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    if (isGoingDown && currentY > 30) {
      setIsScrolling(true);
    } else if (isGoingUp) {
      setIsScrolling(false);
    }
    
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 800);
    lastScrollY.current = currentY;
  };

  const handleSignOut = () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Déconnexion", 
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  };

  const handleOpenSettings = () => {
    router.push("/(app)/(shared)/settings");
  };

  const handleMenuPress = (route: string) => {
    // TODO: Implémenter la navigation vers les sous-pages
    console.log("Navigate to:", route);
    // router.push(route);
  };

  const handleSwitchToPro = () => {
    router.replace("/(app)/(pro)/(tabs)/");
  };

  // Vérifier si l'utilisateur est un professionnel (coiffeur ou salon)
  // Pour tester, mettre isProfessional = true
  const isProfessional = true; // user?.role === "coiffeur" || user?.role === "salon";

  // Données utilisateur (mock si non connecté)
  const userName = user?.full_name || "Utilisateur";
  const userEmail = user?.email || "email@example.com";
  const userImage = user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200";
  
  // Calculer l'année d'inscription (mock pour l'instant)
  const memberYear = "2023";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header avec icône paramètres */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profil</Text>
          <Pressable style={styles.settingsButton} onPress={handleOpenSettings}>
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Image source={{ uri: userImage }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
              <Text style={styles.memberSince}>Membre depuis {memberYear}</Text>
            </View>
            <Pressable style={styles.editButton}>
              <Ionicons name="create-outline" size={18} color={theme.textMuted} />
            </Pressable>
          </View>
          
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_STATS.favorites}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedBookings || MOCK_STATS.appointments}</Text>
              <Text style={styles.statLabel}>RDV</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={styles.statValue}>{MOCK_STATS.rating}</Text>
              </View>
              <Text style={styles.statLabel}>Note</Text>
            </View>
          </View>
        </View>

        {/* Switch to Pro - visible uniquement pour les professionnels */}
        {isProfessional && (
          <Pressable style={styles.switchCard} onPress={handleSwitchToPro}>
            <View style={styles.switchCardLeft}>
              <View style={styles.switchIconContainer}>
                <Ionicons name="briefcase-outline" size={20} color={theme.info} />
              </View>
              <View>
                <Text style={styles.switchCardTitle}>Passer en mode Pro</Text>
                <Text style={styles.switchCardSubtitle}>Gérer vos RDV et revenus</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </Pressable>
        )}

        {/* Mes Favoris Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Mes favoris</Text>
          <View style={styles.menuCard}>
            {FAVORITES_MENU.map((item, index) => (
              <Pressable 
                key={index} 
                style={[
                  styles.menuItem,
                  index < FAVORITES_MENU.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon as any} size={20} color={theme.text} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{item.count}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Mon Compte Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Mon compte</Text>
          <View style={styles.menuCard}>
            {ACCOUNT_MENU.map((item, index) => (
              <Pressable 
                key={index} 
                style={[
                  styles.menuItem,
                  index < ACCOUNT_MENU.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon as any} size={20} color={theme.text} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={theme.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
  },

  // Profile Card
  profileCard: {
    backgroundColor: theme.card,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  memberSince: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 4,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.border,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // Switch Card (Mode Pro)
  switchCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.card,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  switchCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  switchCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.text,
  },
  switchCardSubtitle: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },

  // Menu Sections
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textMuted,
    marginLeft: 20,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: theme.card,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemLabel: {
    fontSize: 15,
    color: theme.text,
    fontWeight: "500",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    backgroundColor: theme.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.textSecondary,
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.errorLight,
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.error,
  },
});