// app/(app)/(pro)/(tabs)/publications.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Image,
  Pressable, 
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

const { width } = Dimensions.get("window");
const GRID_GAP = 3;
const GRID_COLUMNS = 3;
const IMAGE_SIZE = (width - 40 - (GRID_GAP * (GRID_COLUMNS - 1))) / GRID_COLUMNS;

// ============================================
// THEME NAVY
// ============================================
const theme = {
  navy: "#0F172A",
  navyLight: "#1E293B",
  white: "#FFFFFF",
  card: "#F8FAFC",
  text: "#000000",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  accent: "#3B82F6",
  accentLight: "#EFF6FF",
  success: "#10B981",
  successLight: "#ECFDF5",
  warning: "#F59E0B",
};

// ============================================
// DONNÉES MOCK
// ============================================
const MOCK_STATS = {
  posts: 24,
  views: 1250,
  bookings: 38,
};

const MOCK_PUBLICATIONS = [
  { id: "1", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400", views: 156, bookings: 5 },
  { id: "2", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400", views: 127, bookings: 3 },
  { id: "3", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400", views: 98, bookings: 2 },
  { id: "4", image: "https://images.unsplash.com/photo-1560869713-da86bd4d0b69?w=400", views: 89, bookings: 4 },
  { id: "5", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400", views: 72, bookings: 1 },
  { id: "6", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400", views: 65, bookings: 2 },
  { id: "7", image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400", views: 54, bookings: 0 },
  { id: "8", image: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400", views: 48, bookings: 1 },
  { id: "9", image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=400", views: 38, bookings: 0 },
];

// ============================================
// COMPOSANTS
// ============================================
const StatItem = ({ value, label }: { value: number | string; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const PublicationCard = ({ publication }: { publication: typeof MOCK_PUBLICATIONS[0] }) => (
  <Pressable style={styles.publicationCard}>
    <Image source={{ uri: publication.image }} style={styles.publicationImage} />
    {publication.bookings > 0 && (
      <View style={styles.bookingBadge}>
        <Ionicons name="calendar" size={10} color={theme.white} />
        <Text style={styles.bookingBadgeText}>{publication.bookings}</Text>
      </View>
    )}
    <View style={styles.viewsOverlay}>
      <Ionicons name="eye" size={12} color={theme.white} />
      <Text style={styles.viewsText}>{publication.views}</Text>
    </View>
  </Pressable>
);

// ============================================
// ÉCRAN PRINCIPAL
// ============================================
export default function PublicationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"posts" | "products">("posts");

  return (
    <View style={styles.container}>
      {/* Header Navy */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Ma Boutique</Text>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={24} color={theme.white} />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable 
            style={[styles.tab, activeTab === "posts" && styles.tabActive]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={[styles.tabText, activeTab === "posts" && styles.tabTextActive]}>
              Mes réalisations
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === "products" && styles.tabActive]}
            onPress={() => setActiveTab("products")}
          >
            <Text style={[styles.tabText, activeTab === "products" && styles.tabTextActive]}>
              Produits
            </Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatItem value={MOCK_STATS.posts} label="Posts" />
          <View style={styles.statDivider} />
          <StatItem value={MOCK_STATS.views} label="Vues" />
          <View style={styles.statDivider} />
          <StatItem value={MOCK_STATS.bookings} label="RDV générés" />
        </View>
      </View>

      {/* Contenu blanc (style modale) */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "posts" ? (
            <>
              {/* Actions */}
              <View style={styles.actionsRow}>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="camera-outline" size={18} color={theme.white} />
                  <Text style={styles.actionButtonText}>Nouvelle photo</Text>
                </Pressable>
              </View>

              {/* Grid */}
              <View style={styles.gridContainer}>
                {MOCK_PUBLICATIONS.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </View>

              {/* Tips */}
              <View style={styles.tipsCard}>
                <View style={styles.tipsHeader}>
                  <Ionicons name="bulb-outline" size={18} color={theme.warning} />
                  <Text style={styles.tipsTitle}>Conseil</Text>
                </View>
                <Text style={styles.tipsText}>
                  Publiez régulièrement pour augmenter votre visibilité et générer plus de réservations.
                </Text>
              </View>
            </>
          ) : (
            /* Products Tab */
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="bag-outline" size={48} color={theme.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Aucun produit</Text>
              <Text style={styles.emptySubtitle}>
                Ajoutez des produits à vendre à vos clients
              </Text>
              <Pressable style={styles.emptyButton}>
                <Ionicons name="add" size={20} color={theme.white} />
                <Text style={styles.emptyButtonText}>Ajouter un produit</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.navy,
  },
  
  // Header
  header: {
    backgroundColor: theme.navy,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.white,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: theme.white,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
  },
  tabTextActive: {
    color: theme.text,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.white,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Contenu
  content: {
    flex: 1,
    backgroundColor: theme.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },

  // Actions
  actionsRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.navy,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.white,
  },

  // Grid
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: GRID_GAP,
    marginBottom: 24,
  },
  publicationCard: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    overflow: "hidden",
  },
  publicationImage: {
    width: "100%",
    height: "100%",
  },
  bookingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: theme.success,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bookingBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.white,
  },
  viewsOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  viewsText: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.white,
  },

  // Tips
  tipsCard: {
    marginHorizontal: 20,
    backgroundColor: theme.warningLight,
    borderRadius: 14,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.warning,
  },
  tipsText: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.navy,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.white,
  },
});