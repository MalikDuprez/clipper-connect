// app/(app)/(pro)/(tabs)/agenda.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

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
  warningLight: "#FFFBEB",
  error: "#EF4444",
};

// ============================================
// DONNÉES MOCK
// ============================================
const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MOCK_WEEK = [
  { day: 15, weekDay: "Lun", hasAppointments: true, isToday: true },
  { day: 16, weekDay: "Mar", hasAppointments: true },
  { day: 17, weekDay: "Mer", hasAppointments: false },
  { day: 18, weekDay: "Jeu", hasAppointments: true },
  { day: 19, weekDay: "Ven", hasAppointments: true },
  { day: 20, weekDay: "Sam", hasAppointments: false },
  { day: 21, weekDay: "Dim", hasAppointments: false },
];

const MOCK_SCHEDULE = [
  { time: "09:00", type: "available" as const },
  { time: "10:00", type: "appointment" as const, client: "Marie L.", service: "Coupe femme", duration: "45min" },
  { time: "11:00", type: "appointment" as const, client: "Thomas D.", service: "Dégradé américain", duration: "30min" },
  { time: "12:00", type: "break" as const, label: "Pause déjeuner" },
  { time: "14:00", type: "available" as const },
  { time: "14:30", type: "appointment" as const, client: "Julie M.", service: "Coloration", duration: "1h30" },
  { time: "16:00", type: "available" as const },
  { time: "17:00", type: "appointment" as const, client: "Lucas P.", service: "Coupe + Barbe", duration: "1h" },
  { time: "18:00", type: "available" as const },
];

// ============================================
// COMPOSANTS
// ============================================
const DayButton = ({ day, weekDay, hasAppointments, isToday, isSelected, onPress }: {
  day: number;
  weekDay: string;
  hasAppointments: boolean;
  isToday?: boolean;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable 
    style={[
      styles.dayButton,
      isSelected && styles.dayButtonSelected,
    ]} 
    onPress={onPress}
  >
    <Text style={[
      styles.dayWeekText,
      isSelected && styles.dayWeekTextSelected,
    ]}>
      {weekDay}
    </Text>
    <Text style={[
      styles.dayNumberText,
      isSelected && styles.dayNumberTextSelected,
      isToday && !isSelected && styles.dayNumberToday,
    ]}>
      {day}
    </Text>
    {hasAppointments && (
      <View style={[
        styles.dayDot,
        isSelected && styles.dayDotSelected,
      ]} />
    )}
  </Pressable>
);

const TimeSlot = ({ slot }: { slot: typeof MOCK_SCHEDULE[0] }) => {
  if (slot.type === "available") {
    return (
      <View style={styles.slotRow}>
        <Text style={styles.slotTime}>{slot.time}</Text>
        <View style={styles.slotAvailable}>
          <View style={styles.slotAvailableLine} />
          <Text style={styles.slotAvailableText}>Disponible</Text>
        </View>
      </View>
    );
  }

  if (slot.type === "break") {
    return (
      <View style={styles.slotRow}>
        <Text style={styles.slotTime}>{slot.time}</Text>
        <View style={styles.slotBreak}>
          <Ionicons name="cafe-outline" size={16} color={theme.warning} />
          <Text style={styles.slotBreakText}>{slot.label}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.slotRow}>
      <Text style={styles.slotTime}>{slot.time}</Text>
      <Pressable style={styles.slotAppointment}>
        <View style={styles.slotAppointmentLeft}>
          <Text style={styles.slotClient}>{slot.client}</Text>
          <Text style={styles.slotService}>{slot.service}</Text>
        </View>
        <View style={styles.slotDuration}>
          <Text style={styles.slotDurationText}>{slot.duration}</Text>
        </View>
      </Pressable>
    </View>
  );
};

// ============================================
// ÉCRAN PRINCIPAL
// ============================================
export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(15);

  return (
    <View style={styles.container}>
      {/* Header Navy */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Agenda</Text>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={24} color={theme.white} />
          </Pressable>
        </View>
        
        {/* Mois */}
        <View style={styles.monthRow}>
          <Pressable style={styles.monthNavButton}>
            <Ionicons name="chevron-back" size={20} color={theme.white} />
          </Pressable>
          <Text style={styles.monthText}>Décembre 2024</Text>
          <Pressable style={styles.monthNavButton}>
            <Ionicons name="chevron-forward" size={20} color={theme.white} />
          </Pressable>
        </View>

        {/* Semaine */}
        <View style={styles.weekRow}>
          {MOCK_WEEK.map((item) => (
            <DayButton
              key={item.day}
              day={item.day}
              weekDay={item.weekDay}
              hasAppointments={item.hasAppointments}
              isToday={item.isToday}
              isSelected={selectedDay === item.day}
              onPress={() => setSelectedDay(item.day)}
            />
          ))}
        </View>
      </View>

      {/* Contenu blanc (style modale) */}
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="time-outline" size={18} color={theme.accent} />
              <Text style={styles.actionButtonText}>Gérer disponibilités</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.actionButtonFilled]}>
              <Ionicons name="add" size={18} color={theme.white} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextFilled]}>Ajouter RDV</Text>
            </Pressable>
          </View>

          {/* Planning */}
          <View style={styles.scheduleContainer}>
            {MOCK_SCHEDULE.map((slot, index) => (
              <TimeSlot key={index} slot={slot} />
            ))}
          </View>
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

  // Month Nav
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.white,
    marginHorizontal: 20,
  },

  // Week
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    minWidth: 44,
  },
  dayButtonSelected: {
    backgroundColor: theme.white,
  },
  dayWeekText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    marginBottom: 6,
  },
  dayWeekTextSelected: {
    color: theme.textMuted,
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.white,
  },
  dayNumberTextSelected: {
    color: theme.text,
  },
  dayNumberToday: {
    color: theme.accent,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.accent,
    marginTop: 6,
  },
  dayDotSelected: {
    backgroundColor: theme.accent,
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
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.accentLight,
  },
  actionButtonFilled: {
    backgroundColor: theme.navy,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.accent,
  },
  actionButtonTextFilled: {
    color: theme.white,
  },

  // Schedule
  scheduleContainer: {
    paddingHorizontal: 20,
  },
  slotRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  slotTime: {
    width: 50,
    fontSize: 13,
    fontWeight: "500",
    color: theme.textMuted,
    paddingTop: 12,
  },

  // Available
  slotAvailable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.textMuted + "50",
  },
  slotAvailableLine: {
    width: 2,
    height: 16,
    backgroundColor: theme.textMuted + "40",
    marginRight: 10,
    borderRadius: 1,
  },
  slotAvailableText: {
    fontSize: 13,
    color: theme.textMuted,
  },

  // Break
  slotBreak: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: theme.warningLight,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.warning,
  },
  slotBreakText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.warning,
  },

  // Appointment
  slotAppointment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: theme.accentLight,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.accent,
  },
  slotAppointmentLeft: {
    flex: 1,
  },
  slotClient: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },
  slotService: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  slotDuration: {
    backgroundColor: theme.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slotDurationText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.textSecondary,
  },
});