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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef } from "react";
import { useScrollContext } from "./_layout";

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#EBEBEB",
  card: "#F8F8F8",
};

const USER = {
  name: "Alexandre Martin",
  email: "alex.martin@email.com",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  memberSince: "Membre depuis 2023",
};

const MENU_ITEMS = [
  {
    section: "Compte",
    items: [
      { icon: "person-outline", label: "Informations personnelles", chevron: true },
      { icon: "card-outline", label: "Moyens de paiement", chevron: true },
      { icon: "location-outline", label: "Adresses enregistrées", chevron: true },
    ],
  },
  {
    section: "Préférences",
    items: [
      { icon: "notifications-outline", label: "Notifications", chevron: true },
      { icon: "globe-outline", label: "Langue", value: "Français", chevron: true },
      { icon: "moon-outline", label: "Apparence", value: "Clair", chevron: true },
    ],
  },
  {
    section: "Aide",
    items: [
      { icon: "help-circle-outline", label: "Centre d'aide", chevron: true },
      { icon: "chatbubble-outline", label: "Nous contacter", chevron: true },
      { icon: "document-text-outline", label: "Conditions d'utilisation", chevron: true },
      { icon: "shield-checkmark-outline", label: "Politique de confidentialité", chevron: true },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { setIsScrolling } = useScrollContext();
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 16 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profil</Text>
        </View>

        {/* Profile Card */}
        <Pressable style={styles.profileCard}>
          <Image source={{ uri: USER.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{USER.name}</Text>
            <Text style={styles.profileEmail}>{USER.email}</Text>
            <Text style={styles.memberSince}>{USER.memberSince}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </Pressable>

        {/* Menu Sections */}
        {MENU_ITEMS.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <Pressable 
                  key={itemIndex} 
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconContainer}>
                      <Ionicons name={item.icon as any} size={20} color={theme.text} />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.value && <Text style={styles.menuItemValue}>{item.value}</Text>}
                    {item.chevron && <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Pressable style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

        <View style={{ height: 120 }} />
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
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
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
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemLabel: {
    fontSize: 15,
    color: theme.text,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    color: theme.textMuted,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E53935",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: theme.textMuted,
  },
});