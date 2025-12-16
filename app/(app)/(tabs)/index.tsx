// app/(app)/(tabs)/index.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  TextInput, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent, 
  Platform, 
  Modal, 
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InspirationCard, InspirationModal, CoiffeurCard } from "@shared";
import SuccessModal from "@components/shared/SuccessModal";
import { useScrollContext } from "./_layout";
import { INSPIRATIONS, COIFFEURS, FILTERS, SEARCH_FILTERS } from "@constants/mockData";

const { height } = Dimensions.get("window");

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#EBEBEB",
  activeBackground: "rgba(0,0,0,0.06)",
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsScrolling } = useScrollContext();
  const [activeTab, setActiveTab] = useState<string>("inspiration");
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSearchFilters, setActiveSearchFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  
  const [selectedInspiration, setSelectedInspiration] = useState<typeof INSPIRATIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successData, setSuccessData] = useState<{
    title: string;
    subtitle: string;
    recapImage?: string;
    recapTitle?: string;
    recapSubtitle?: string;
    recapItems?: { icon: string; text: string }[];
    priceLabel?: string;
    priceValue?: string;
    buttonText?: string;
  }>({ title: "", subtitle: "" });
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const isGoingDown = currentY > lastScrollY.current;
    const isGoingUp = currentY < lastScrollY.current;
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    if (isGoingDown && currentY > 30) {
      setIsScrolling(true);
    } else if (isGoingUp) {
      setIsScrolling(false);
    }
    
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
    
    lastScrollY.current = currentY;
  };

  const handleInspirationPress = (item: typeof INSPIRATIONS[0]) => {
    setSelectedInspiration(item);
    setModalVisible(true);
  };

  const handleBook = () => {
    setModalVisible(false);
    if (selectedInspiration) {
      router.push(`/inspiration/${selectedInspiration.id}`);
    }
  };

  const toggleFilter = (filter: string) => {
    if (activeTab === "inspiration") {
      if (filter === "Tout") {
        setActiveFilters([]);
      } else {
        setActiveFilters(prev => 
          prev.includes(filter) 
            ? prev.filter(f => f !== filter)
            : [...prev, filter]
        );
      }
    } else {
      if (filter === "À proximité") {
        setActiveSearchFilters([]);
      } else {
        setActiveSearchFilters(prev => 
          prev.includes(filter) 
            ? prev.filter(f => f !== filter)
            : [...prev, filter]
        );
      }
    }
  };

  const filteredInspirations = useMemo(() => {
    if (activeFilters.length === 0) return INSPIRATIONS;
    return INSPIRATIONS.filter((item) => 
      activeFilters.some(filter => 
        item.category.toLowerCase() === filter.toLowerCase()
      )
    );
  }, [activeFilters]);

  const leftColumn = filteredInspirations.filter((_, index) => index % 2 === 0);
  const rightColumn = filteredInspirations.filter((_, index) => index % 2 === 1);

  const filteredCoiffeurs = useMemo(() => {
    let results = COIFFEURS;
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter((c) => 
        c.name.toLowerCase().includes(searchLower) ||
        c.salon.toLowerCase().includes(searchLower) ||
        c.specialty.toLowerCase().includes(searchLower)
      );
    }
    return results;
  }, [search]);

  const currentFilters = activeTab === "inspiration" ? FILTERS : SEARCH_FILTERS;
  const filteredFiltersInModal = currentFilters.filter(filter => 
    filter.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const hasActiveFilters = activeTab === "inspiration" 
    ? activeFilters.length > 0 
    : activeSearchFilters.length > 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTabs}>
          {/* Tab Inspiration */}
          <Pressable 
            onPress={() => setActiveTab("inspiration")}
            style={[
              styles.headerTab,
              activeTab === "inspiration" && styles.headerTabActive,
            ]}
          >
            <Ionicons 
              name={activeTab === "inspiration" ? "sparkles" : "sparkles-outline"} 
              size={18} 
              color={activeTab === "inspiration" ? "#000" : "#999"} 
            />
            <Text style={[
              styles.headerTabText,
              activeTab === "inspiration" && styles.headerTabTextActive,
            ]}>
              Inspiration
            </Text>
          </Pressable>

          {/* Tab Coiffeurs */}
          <Pressable 
            onPress={() => setActiveTab("recherche")}
            style={[
              styles.headerTab,
              styles.headerTabLarge,
              activeTab === "recherche" && styles.headerTabActive,
            ]}
          >
            <Ionicons 
              name={activeTab === "recherche" ? "location" : "location-outline"} 
              size={18} 
              color={activeTab === "recherche" ? "#000" : "#999"} 
            />
            <Text 
              style={[
                styles.headerTabText,
                activeTab === "recherche" && styles.headerTabTextActive,
              ]}
              numberOfLines={1}
            >
              Coiffeurs à proximité
            </Text>
          </Pressable>

          {/* Bouton Filtre */}
          <Pressable 
            onPress={() => setFilterModalVisible(true)} 
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
            ]}
          >
            <Ionicons name="options-outline" size={20} color={hasActiveFilters ? "#000" : "#999"} />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeTab === "inspiration" ? activeFilters.length : activeSearchFilters.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* CONTENU */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 70 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* TAB INSPIRATION */}
        {activeTab === "inspiration" && (
          <>
            {activeFilters.length > 0 && (
              <View style={styles.filtersActive}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filtersRow}>
                    {activeFilters.map((filter) => (
                      <View key={filter} style={styles.filterChip}>
                        <Text style={styles.filterChipText}>{filter}</Text>
                        <Pressable onPress={() => toggleFilter(filter)}>
                          <Ionicons name="close-circle" size={16} color="#666" />
                        </Pressable>
                      </View>
                    ))}
                    <Pressable onPress={() => setActiveFilters([])}>
                      <Text style={styles.clearFilters}>Tout effacer</Text>
                    </Pressable>
                  </View>
                </ScrollView>
                <Text style={styles.resultsCount}>
                  {filteredInspirations.length} résultat{filteredInspirations.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
            
            <View style={styles.feed}>
              {filteredInspirations.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="images-outline" size={60} color="#DDD" />
                  <Text style={styles.emptyStateText}>Aucune inspiration trouvée</Text>
                </View>
              ) : (
                <View style={styles.masonry}>
                  <View style={styles.masonryColumn}>
                    {leftColumn.map((item) => (
                      <InspirationCard 
                        key={item.id} 
                        item={item} 
                        onPress={() => handleInspirationPress(item)} 
                      />
                    ))}
                  </View>
                  <View style={[styles.masonryColumn, { marginTop: 24 }]}>
                    {rightColumn.map((item) => (
                      <InspirationCard 
                        key={item.id} 
                        item={item} 
                        onPress={() => handleInspirationPress(item)} 
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {/* TAB COIFFEURS */}
        {activeTab === "recherche" && (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <Ionicons name="search" size={18} color="#999" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Rechercher salon, coiffeur, ville..."
                  placeholderTextColor="#999"
                  style={styles.searchTextInput}
                />
                {search.length > 0 && (
                  <Pressable onPress={() => setSearch("")}>
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </Pressable>
                )}
              </View>
            </View>
            
            {activeSearchFilters.length > 0 && (
              <View style={styles.filtersActive}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filtersRow}>
                    {activeSearchFilters.map((filter) => (
                      <View key={filter} style={styles.filterChip}>
                        <Text style={styles.filterChipText}>{filter}</Text>
                        <Pressable onPress={() => toggleFilter(filter)}>
                          <Ionicons name="close-circle" size={16} color="#666" />
                        </Pressable>
                      </View>
                    ))}
                    <Pressable onPress={() => setActiveSearchFilters([])}>
                      <Text style={styles.clearFilters}>Tout effacer</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            )}
            
            <View style={styles.coiffeursList}>
              {filteredCoiffeurs.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={60} color="#DDD" />
                  <Text style={styles.emptyStateText}>Aucun coiffeur trouvé</Text>
                </View>
              ) : (
                <>
                  {filteredCoiffeurs.map((item) => (
                    <CoiffeurCard 
                      key={item.id} 
                      item={item} 
                      onPress={() => router.push(`/coiffeur/${item.id}`)} 
                    />
                  ))}
                </>
              )}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* MODAL FILTRES */}
      <Modal visible={filterModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => {
              setFilterModalVisible(false);
              setFilterSearch("");
            }}
          >
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHandle} />
              
              <View style={styles.modalBody}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filtrer par catégorie</Text>
                  {hasActiveFilters && (
                    <Text style={styles.modalSubtitle}>
                      {activeTab === "inspiration" ? activeFilters.length : activeSearchFilters.length} sélectionné(s)
                    </Text>
                  )}
                </View>
                
                <View style={styles.modalSearchInput}>
                  <Ionicons name="search" size={18} color="#999" />
                  <TextInput
                    value={filterSearch}
                    onChangeText={setFilterSearch}
                    placeholder="Rechercher un filtre..."
                    placeholderTextColor="#999"
                    style={styles.modalSearchTextInput}
                  />
                  {filterSearch.length > 0 && (
                    <Pressable onPress={() => setFilterSearch("")}>
                      <Ionicons name="close-circle" size={18} color="#999" />
                    </Pressable>
                  )}
                </View>
                
                <ScrollView style={styles.modalFiltersScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalFiltersGrid}>
                    {filteredFiltersInModal.map((filter) => {
                      const isSelected = activeTab === "inspiration" 
                        ? activeFilters.includes(filter)
                        : activeSearchFilters.includes(filter);
                      const isDefault = filter === "Tout" || filter === "À proximité";
                      
                      return (
                        <Pressable
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[
                            styles.modalFilterItem,
                            isSelected && styles.modalFilterItemSelected,
                          ]}
                        >
                          {!isDefault && (
                            <View style={[
                              styles.checkbox,
                              isSelected && styles.checkboxSelected,
                            ]}>
                              {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                          )}
                          <Text style={[
                            styles.modalFilterText,
                            isSelected && styles.modalFilterTextSelected,
                          ]}>
                            {filter}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
                
                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => {
                      if (activeTab === "inspiration") setActiveFilters([]);
                      else setActiveSearchFilters([]);
                    }}
                    style={styles.modalResetButton}
                  >
                    <Text style={styles.modalResetText}>Réinitialiser</Text>
                  </Pressable>
                  
                  <Pressable
                    onPress={() => {
                      setFilterModalVisible(false);
                      setFilterSearch("");
                    }}
                    style={styles.modalApplyButton}
                  >
                    <Text style={styles.modalApplyText}>Appliquer</Text>
                  </Pressable>
                </View>
              </View>
              
              <View style={{ height: 34 }} />
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL INSPIRATION */}
      <InspirationModal
        visible={modalVisible}
        item={selectedInspiration}
        onClose={() => setModalVisible(false)}
        onBook={handleBook}
        onSuccess={(data) => {
          setModalVisible(false);
          setSelectedInspiration(null);
          setSuccessData(data);
          setSuccessModalVisible(true);
        }}
      />

      {/* SUCCESS MODAL */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={successData.title}
        subtitle={successData.subtitle}
        recapImage={successData.recapImage}
        recapTitle={successData.recapTitle}
        recapSubtitle={successData.recapSubtitle}
        recapItems={successData.recapItems}
        priceLabel={successData.priceLabel}
        priceValue={successData.priceValue}
        buttonText={successData.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  
  // Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  headerTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    backgroundColor: "transparent",
    gap: 6,
  },
  headerTabLarge: {
    flex: 1,
  },
  headerTabActive: {
    backgroundColor: "#F0F0F0",
  },
  headerTabText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  headerTabTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#F0F0F0",
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  
  // Filtres actifs
  filtersActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 10,
    gap: 6,
  },
  filterChipText: {
    color: "#000",
    fontSize: 13,
  },
  clearFilters: {
    color: "#999",
    fontSize: 12,
    paddingHorizontal: 8,
  },
  resultsCount: {
    color: "#999",
    fontSize: 12,
    marginTop: 6,
  },
  
  // Feed
  feed: {
    paddingHorizontal: 12,
  },
  masonry: {
    flexDirection: "row",
  },
  masonryColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  
  // Empty state
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateText: {
    color: "#999",
    marginTop: 16,
    fontSize: 16,
  },
  
  // Search
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchTextInput: {
    flex: 1,
    color: "#000",
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  
  // Coiffeurs
  coiffeursList: {
    paddingHorizontal: 16,
  },
  
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalBody: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  modalSubtitle: {
    color: "#666",
    fontSize: 13,
  },
  modalSearchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  modalSearchTextInput: {
    flex: 1,
    color: "#000",
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  modalFiltersScroll: {
    maxHeight: 280,
  },
  modalFiltersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalFilterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    gap: 8,
  },
  modalFilterItemSelected: {
    backgroundColor: "#000",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  modalFilterText: {
    fontSize: 14,
    color: "#000",
  },
  modalFilterTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalResetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  modalResetText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 14,
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#000",
  },
  modalApplyText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});