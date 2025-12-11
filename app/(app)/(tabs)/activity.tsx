// app/(app)/(tabs)/activity.tsx
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
import { useRouter } from "expo-router";
import { useScrollContext } from "./_layout";
import { useBookingStore, BookingItem } from "@stores/bookingStore";

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#EBEBEB",
  card: "#F8F8F8",
  success: "#2E7D32",
  successLight: "#E8F5E9",
};

// Données mock pour les RDV passés (historique)
const MOCK_PAST_APPOINTMENTS = [
  {
    id: "past-1",
    salon: "Barbershop Marco",
    service: "Coupe Homme",
    date: "10 Jan 2025",
    price: "35€",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200",
    rated: true,
  },
  {
    id: "past-2",
    salon: "Salon Élégance",
    service: "Balayage",
    date: "3 Jan 2025",
    price: "120€",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200",
    rated: false,
  },
];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setIsScrolling } = useScrollContext();
  const { bookings, cancelBooking } = useBookingStore();
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Filtrer les réservations à venir et passées
  const upcomingBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

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

  const handleCancelBooking = (id: string) => {
    cancelBooking(id);
  };

  const renderUpcomingBooking = (booking: BookingItem) => (
    <Pressable key={booking.id} style={styles.upcomingCard}>
      <Image source={{ uri: booking.inspiration.image }} style={styles.upcomingImage} />
      <View style={styles.upcomingContent}>
        <View style={styles.upcomingHeader}>
          <Text style={styles.upcomingSalon}>{booking.coiffeur.salon}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmé</Text>
          </View>
        </View>
        <Text style={styles.upcomingService}>{booking.inspiration.title}</Text>
        <View style={styles.upcomingMeta}>
          <View style={styles.upcomingMetaItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{booking.date}, {booking.dateFormatted}</Text>
          </View>
          <View style={styles.upcomingMetaItem}>
            <Ionicons name="time-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{booking.time}</Text>
          </View>
        </View>
        <View style={styles.upcomingCoiffeur}>
          <Image source={{ uri: booking.coiffeur.image }} style={styles.coiffeurAvatar} />
          <Text style={styles.coiffeurName}>{booking.coiffeur.name}</Text>
        </View>
        <View style={styles.upcomingActions}>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Modifier</Text>
          </Pressable>
          <Pressable 
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={() => handleCancelBooking(booking.id)}
          >
            <Text style={styles.actionBtnTextOutline}>Annuler</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

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
          <Text style={styles.pageTitle}>Activité</Text>
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À venir</Text>
          
          {upcomingBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={40} color={theme.textMuted} />
              <Text style={styles.emptyText}>Aucun rendez-vous prévu</Text>
              <Pressable 
                style={styles.bookButton}
                onPress={() => router.push("/(tabs)/")}
              >
                <Text style={styles.bookButtonText}>Réserver maintenant</Text>
              </Pressable>
            </View>
          ) : (
            upcomingBookings.map(renderUpcomingBooking)
          )}
        </View>

        {/* Past Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Passés</Text>
            <Pressable>
              <Ionicons name="filter-outline" size={20} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Réservations passées du store */}
          {pastBookings.map((booking) => (
            <Pressable key={booking.id} style={styles.pastCard}>
              <Image source={{ uri: booking.inspiration.image }} style={styles.pastImage} />
              <View style={styles.pastInfo}>
                <Text style={styles.pastSalon}>{booking.coiffeur.salon}</Text>
                <Text style={styles.pastService}>{booking.inspiration.title}</Text>
                <Text style={styles.pastDate}>
                  {booking.date}, {booking.dateFormatted} • {booking.inspiration.price}€
                </Text>
              </View>
              <View style={styles.pastActions}>
                <Pressable style={styles.rateBtn}>
                  <Ionicons name="star-outline" size={16} color={theme.text} />
                  <Text style={styles.rateBtnText}>Noter</Text>
                </Pressable>
                <Pressable style={styles.rebookBtn}>
                  <Ionicons name="refresh-outline" size={16} color="#FFF" />
                  <Text style={styles.rebookBtnText}>Réserver</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}

          {/* Données mock historique */}
          {MOCK_PAST_APPOINTMENTS.map((apt) => (
            <Pressable key={apt.id} style={styles.pastCard}>
              <Image source={{ uri: apt.image }} style={styles.pastImage} />
              <View style={styles.pastInfo}>
                <Text style={styles.pastSalon}>{apt.salon}</Text>
                <Text style={styles.pastService}>{apt.service}</Text>
                <Text style={styles.pastDate}>{apt.date} • {apt.price}</Text>
              </View>
              <View style={styles.pastActions}>
                {!apt.rated && (
                  <Pressable style={styles.rateBtn}>
                    <Ionicons name="star-outline" size={16} color={theme.text} />
                    <Text style={styles.rateBtnText}>Noter</Text>
                  </Pressable>
                )}
                <Pressable style={styles.rebookBtn}>
                  <Ionicons name="refresh-outline" size={16} color="#FFF" />
                  <Text style={styles.rebookBtnText}>Réserver</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>

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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 16,
  },
  emptyCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: theme.textMuted,
    marginTop: 12,
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: theme.text,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bookButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  
  // Upcoming Card
  upcomingCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  upcomingImage: {
    width: "100%",
    height: 140,
  },
  upcomingContent: {
    padding: 16,
  },
  upcomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  upcomingSalon: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.text,
  },
  statusBadge: {
    backgroundColor: theme.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: theme.success,
    fontWeight: "500",
  },
  upcomingService: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  upcomingMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  upcomingMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  upcomingCoiffeur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  coiffeurAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  coiffeurName: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },
  upcomingActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.text,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionBtnTextOutline: {
    color: theme.text,
    fontWeight: "600",
    fontSize: 14,
  },
  
  // Past Card
  pastCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  pastImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  pastInfo: {
    marginBottom: 12,
  },
  pastSalon: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
  },
  pastService: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  pastDate: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 4,
  },
  pastActions: {
    flexDirection: "row",
    gap: 10,
  },
  rateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.background,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  rateBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.text,
  },
  rebookBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.text,
    paddingVertical: 10,
    borderRadius: 10,
  },
  rebookBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFF",
  },
});