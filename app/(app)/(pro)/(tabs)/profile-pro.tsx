// app/(app)/(pro)/(tabs)/profile-pro.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Image,
  Pressable, 
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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

// ============================================
// DONNÉES MOCK
// ============================================
const MOCK_PRO_PROFILE = {
  name: "Marco Rossi",
  specialty: "Barbier",
  location: "Paris 11e",
  rating: 4.8,
  reviewCount: 127,
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  verified: true,
};

const INFO_MENU = [
  { icon: "create-outline", label: "Bio et présentation" },
  { icon: "cash-outline", label: "Tarifs et services" },
  { icon: "ribbon-outline", label: "Spécialités" },
  { icon: "map-outline", label: "Zone d'intervention" },
  { icon: "time-outline", label: "Horaires de travail" },
];

const REVENUE_MENU = [
  { icon: "card-outline", label: "Informations bancaires" },
  { icon: "receipt-outline", label: "Historique des paiements" },
  { icon: "stats-chart-outline", label: "Statistiques détaillées" },
];

// ============================================
// ÉCRAN PRINCIPAL
// ============================================
export default function ProfileProScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSwitchToClient = () => {
  router.replace("/(app)/(tabs)/salon");
  };

  const handleOpenSettings = () => {
    router.push("/(app)/(shared)/settings");
  };

  const handleViewPublicProfile = () => {
    console.log("View public profile");
  };

  const handleMenuPress = (label: string) => {
    console.log("Navigate to:", label);
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
          onPress: () => {
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Mon profil pro</Text>
          <Pressable style={styles.settingsButton} onPress={handleOpenSettings}>
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: MOCK_PRO_PROFILE.image }} style={styles.profileImage} />
              {MOCK_PRO_PROFILE.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{MOCK_PRO_PROFILE.name}</Text>
              <Text style={styles.profileSpecialty}>
                {MOCK_PRO_PROFILE.specialty} • {MOCK_PRO_PROFILE.location}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}>
                  {MOCK_PRO_PROFILE.rating} ({MOCK_PRO_PROFILE.reviewCount} avis)
                </Text>
              </View>
            </View>
          </View>
          
          <Pressable style={styles.viewProfileButton} onPress={handleViewPublicProfile}>
            <Ionicons name="eye-outline" size={18} color={theme.text} />
            <Text style={styles.viewProfileButtonText}>Voir mon profil public</Text>
          </Pressable>
        </View>

        {/* Switch to Client */}
        <Pressable style={styles.switchCard} onPress={handleSwitchToClient}>
          <View style={styles.switchCardLeft}>
            <View style={styles.switchIconContainer}>
              <Ionicons name="swap-horizontal" size={20} color={theme.info} />
            </View>
            <View>
              <Text style={styles.switchCardTitle}>Passer en mode Client</Text>
              <Text style={styles.switchCardSubtitle}>Accéder à l'espace client</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </Pressable>

        {/* Informations Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.menuCard}>
            {INFO_MENU.map((item, index) => (
              <Pressable 
                key={index} 
                style={[
                  styles.menuItem,
                  index < INFO_MENU.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item.label)}
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

        {/* Revenus Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Revenus</Text>
          <View style={styles.menuCard}>
            {REVENUE_MENU.map((item, index) => (
              <Pressable 
                key={index} 
                style={[
                  styles.menuItem,
                  index < REVENUE_MENU.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item.label)}
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

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
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
  profileCard: {
    backgroundColor: theme.card,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  profileTop: {
    flexDirection: "row",
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.info,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.card,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  profileSpecialty: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: "500",
  },
  viewProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: theme.background,
    borderRadius: 12,
  },
  viewProfileButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },
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