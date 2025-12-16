// app/(app)/(pro)/(tabs)/dashboard.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  StyleSheet,
  Image,
  Modal,
  Animated,
  Dimensions,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";

const { height } = Dimensions.get("window");

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
  warningLight: "#FEF3C7",
  error: "#EF4444",
  border: "#E2E8F0",
};

// ============================================
// DONNÉES MOCK
// ============================================
const MOCK_USER = {
  name: "Antoine",
  specialty: "Coiffeur Pro",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
};

const MOCK_NEXT_APPOINTMENT = {
  time: "11:00",
  address: "12.2 Rue du Salon",
  clientCount: 3,
};

const MOCK_TODAY_REVENUE = 85;

const MOCK_UPCOMING = [
  { id: "1", time: "11:00", client: "Marie L.", service: "Coupe femme", status: "confirmed" },
  { id: "2", time: "14:30", client: "Thomas D.", service: "Dégradé", status: "confirmed" },
  { id: "3", time: "16:00", client: "Julie M.", service: "Coloration", status: "pending" },
];

const MOCK_NOTIF_COUNT = 3;
const MOCK_MESSAGE_COUNT = 2;

// ============================================
// MENU ITEMS
// ============================================
const MENU_ITEMS = [
  { 
    icon: "chatbubbles-outline", 
    label: "Messages", 
    badge: MOCK_MESSAGE_COUNT,
    route: "messages",
  },
  { 
    icon: "swap-horizontal", 
    label: "Passer en mode Client", 
    route: "switch",
  },
  { 
    icon: "settings-outline", 
    label: "Paramètres", 
    route: "settings",
  },
];

// ============================================
// COMPOSANTS
// ============================================
const StatCard = ({ icon, label, value, color, bgColor, onPress }: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  onPress?: () => void;
}) => (
  <Pressable style={styles.statCard} onPress={onPress}>
    <View style={[styles.statIconContainer, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Pressable>
);

const AppointmentRow = ({ appointment, onPress }: { 
  appointment: typeof MOCK_UPCOMING[0];
  onPress: () => void;
}) => (
  <Pressable style={styles.appointmentRow} onPress={onPress}>
    <View style={styles.appointmentTime}>
      <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
    </View>
    <View style={styles.appointmentInfo}>
      <Text style={styles.appointmentClient}>{appointment.client}</Text>
      <Text style={styles.appointmentService}>{appointment.service}</Text>
    </View>
    <View style={[
      styles.statusBadge,
      appointment.status === "pending" && styles.statusBadgePending
    ]}>
      <Text style={[
        styles.statusText,
        appointment.status === "pending" && styles.statusTextPending
      ]}>
        {appointment.status === "confirmed" ? "Confirmé" : "En attente"}
      </Text>
    </View>
  </Pressable>
);

// ============================================
// MENU MODAL
// ============================================
const MenuModal = ({ visible, onClose, onItemPress, isOnline, onToggleOnline }: {
  visible: boolean;
  onClose: () => void;
  onItemPress: (route: string) => void;
  isOnline: boolean;
  onToggleOnline: (value: boolean) => void;
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { 
          toValue: 0, 
          tension: 65, 
          friction: 11, 
          useNativeDriver: true 
        }),
        Animated.timing(backdropAnim, { 
          toValue: 1, 
          duration: 300, 
          useNativeDriver: true 
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { 
        toValue: height, 
        duration: 250, 
        useNativeDriver: true 
      }),
      Animated.timing(backdropAnim, { 
        toValue: 0, 
        duration: 200, 
        useNativeDriver: true 
      }),
    ]).start(() => onClose());
  };

  const handleItemPress = (route: string) => {
    handleClose();
    setTimeout(() => onItemPress(route), 300);
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.menuCard, 
            { 
              transform: [{ translateY: slideAnim }],
              paddingBottom: insets.bottom + 20,
            }
          ]}
        >
          <View style={styles.dragIndicatorContainer}>
            <View style={styles.dragIndicator} />
          </View>

          <View style={styles.menuContent}>
            {/* Toggle En ligne / Hors ligne */}
            <View style={styles.onlineToggleContainer}>
              <View style={styles.onlineToggleLeft}>
                <View style={[
                  styles.onlineIndicator,
                  { backgroundColor: isOnline ? theme.success : theme.textMuted }
                ]} />
                <View>
                  <Text style={styles.onlineToggleLabel}>
                    {isOnline ? "En ligne" : "Hors ligne"}
                  </Text>
                  <Text style={styles.onlineToggleSubtext}>
                    {isOnline ? "Vous êtes visible par les clients" : "Vous n'apparaissez pas dans les recherches"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isOnline}
                onValueChange={onToggleOnline}
                trackColor={{ false: theme.border, true: theme.successLight }}
                thumbColor={isOnline ? theme.success : theme.textMuted}
              />
            </View>

            {/* Menu Items */}
            {MENU_ITEMS.map((item, index) => (
              <Pressable 
                key={index} 
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleItemPress(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon as any} size={22} color={theme.text} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && item.badge > 0 && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ============================================
// ÉCRAN PRINCIPAL
// ============================================
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    // TODO: Sauvegarder le statut dans le store/backend
  };

  const handleNotifications = () => {
    // TODO: Page notifications
    console.log("Open notifications");
  };

  const handleMenuItemPress = (route: string) => {
    switch (route) {
      case "messages":
        // TODO: Page messages
        console.log("Open messages");
        break;
      case "switch":
        router.replace("/(app)/(tabs)/salon");
        break;
      case "settings":
        router.push("/(app)/(shared)/settings");
        break;
    }
  };

  const handleAppointmentPress = (id: string) => {
    // TODO: Détail RDV
    console.log("Open appointment:", id);
  };

  const handleViewPlanning = () => {
    router.push("/(app)/(pro)/(tabs)/agenda");
  };

  const handleStatPress = (type: string) => {
    switch (type) {
      case "revenue":
        // TODO: Page revenus
        console.log("Open revenue");
        break;
      case "rdv":
        router.push("/(app)/(pro)/(tabs)/agenda");
        break;
      case "rating":
        // TODO: Page avis
        console.log("Open reviews");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Navy */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <Image source={{ uri: MOCK_USER.image }} style={styles.profileImage} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Bonjour, {MOCK_USER.name}</Text>
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{MOCK_USER.specialty}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {/* Notifications */}
            <Pressable style={styles.headerButton} onPress={handleNotifications}>
              <Ionicons name="notifications-outline" size={22} color={theme.white} />
              {MOCK_NOTIF_COUNT > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{MOCK_NOTIF_COUNT}</Text>
                </View>
              )}
            </Pressable>
            {/* Menu */}
            <Pressable style={styles.headerButton} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={22} color={theme.white} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Contenu blanc (style modale) */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Prochaine réservation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prochaine réservation</Text>
            <Pressable 
              style={styles.nextCard}
              onPress={() => handleAppointmentPress("next")}
            >
              <View style={styles.nextCardRow}>
                <Text style={styles.nextLabel}>Prochaine réservation</Text>
                <Text style={styles.nextTime}>{MOCK_NEXT_APPOINTMENT.time}</Text>
              </View>
              <Text style={styles.nextAddress}>{MOCK_NEXT_APPOINTMENT.address}</Text>
              <View style={styles.nextClientsRow}>
                <Text style={styles.nextClients}>{MOCK_NEXT_APPOINTMENT.clientCount} présents</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </View>
            </Pressable>
          </View>

          {/* Stats rapides */}
          <View style={styles.statsRow}>
            <StatCard 
              icon="cash-outline" 
              label="Aujourd'hui" 
              value={`${MOCK_TODAY_REVENUE}€`}
              color={theme.success}
              bgColor={theme.successLight}
              onPress={() => handleStatPress("revenue")}
            />
            <StatCard 
              icon="calendar-outline" 
              label="RDV" 
              value={MOCK_UPCOMING.length}
              color={theme.accent}
              bgColor={theme.accentLight}
              onPress={() => handleStatPress("rdv")}
            />
            <StatCard 
              icon="star" 
              label="Note" 
              value="4.8"
              color={theme.warning}
              bgColor={theme.warningLight}
              onPress={() => handleStatPress("rating")}
            />
          </View>

          {/* Bouton Planning */}
          <Pressable style={styles.planningButton} onPress={handleViewPlanning}>
            <Ionicons name="calendar" size={20} color={theme.white} />
            <Text style={styles.planningButtonText}>Voir mon planning</Text>
          </Pressable>

          {/* RDV du jour */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Aujourd'hui</Text>
              <Pressable onPress={handleViewPlanning}>
                <Text style={styles.seeAll}>Tout voir</Text>
              </Pressable>
            </View>
            <View style={styles.appointmentsList}>
              {MOCK_UPCOMING.map((apt) => (
                <AppointmentRow 
                  key={apt.id} 
                  appointment={apt} 
                  onPress={() => handleAppointmentPress(apt.id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Menu Modal */}
      <MenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)}
        onItemPress={handleMenuItemPress}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
      />
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
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.white,
  },
  specialtyBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  specialtyText: {
    fontSize: 12,
    color: theme.white,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notifBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.white,
  },

  // Contenu
  content: {
    flex: 1,
    backgroundColor: theme.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  scrollView: {
    flex: 1,
    paddingTop: 24,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    color: theme.accent,
    fontWeight: "500",
  },

  // Next Card
  nextCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
  },
  nextCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nextLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  nextTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  nextAddress: {
    fontSize: 14,
    color: theme.textMuted,
    marginBottom: 12,
  },
  nextClientsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.textMuted + "30",
  },
  nextClients: {
    fontSize: 14,
    color: theme.text,
    fontWeight: "500",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
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

  // Planning Button
  planningButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.navy,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 24,
  },
  planningButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.white,
  },

  // Appointments
  appointmentsList: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
  },
  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.textMuted + "20",
  },
  appointmentTime: {
    width: 50,
  },
  appointmentTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  appointmentClient: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },
  appointmentService: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: theme.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgePending: {
    backgroundColor: theme.warningLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.success,
  },
  statusTextPending: {
    color: theme.warning,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuCard: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragIndicatorContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
  },
  menuContent: {
    paddingHorizontal: 20,
  },
  
  // Online Toggle
  onlineToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  onlineToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  onlineToggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
  },
  onlineToggleSubtext: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
    maxWidth: 200,
  },
  
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.text,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.white,
  },
});