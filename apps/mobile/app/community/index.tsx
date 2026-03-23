import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { colors, fonts, getColors, gold, stone } from '../../constants/colors';
import { ScreenBackground } from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';
import { ThemedCard } from '../../components/ThemedCard';
import { getCurrentProfile, type UserProfile } from '../../services/authService';
import {
  COMMUNITY_MESSAGE_MAX_LENGTH,
  getLatestUpgradeRequest,
  getUpgradeRequestStatusLabel,
  isKynoPlusPlan,
  listCommunityMessages,
  sendCommunityMessage,
  subscribeToCommunityMessages,
} from '../../services/kynoPlusService';
import type { Database } from '../../types/database';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useScreenEntrance } from '../../hooks/useScreenEntrance';
import { AnimatedPressable } from '../../components/AnimatedPressable';

type MembershipUpgradeRequest = Database['public']['Tables']['membership_upgrade_requests']['Row'];
type CommunityMessage = Database['public']['Tables']['community_messages']['Row'];

function formatTimestamp(value?: string | null) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function mergeMessage(current: CommunityMessage[], next: CommunityMessage) {
  if (current.some(message => message.id === next.id)) {
    return current;
  }

  return [...current, next].slice(-50);
}

function getRequestMessage(request: MembershipUpgradeRequest | null) {
  if (!request?.status) {
    return 'Upgrade from the membership screen to unlock the live members room.';
  }

  if (request.status === 'pending') {
    return 'Your KYNO+ request is in review. Access opens as soon as the premium plan is activated on your profile.';
  }

  if (request.status === 'approved') {
    return 'Your request has been approved. We are waiting on the final manual activation step.';
  }

  return 'Your last request was declined. You can submit another request from the membership screen.';
}

function AnimatedMessageCard({ children }: { children: React.ReactNode }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 280 });
    scale.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function CommunityScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [request, setRequest] = useState<MembershipUpgradeRequest | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(useCallback(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function loadState() {
      setLoading(true);
      setError('');

      try {
        const nextProfile = await getCurrentProfile();
        const nextRequest = await getLatestUpgradeRequest().catch(() => null);

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setRequest(nextRequest);

        if (!isKynoPlusPlan(nextProfile)) {
          setMessages([]);
          setLoading(false);
          return;
        }

        const nextMessages = await listCommunityMessages();

        if (!isMounted) {
          return;
        }

        setMessages(nextMessages);
        unsubscribe = subscribeToCommunityMessages((message) => {
          if (!isMounted) {
            return;
          }

          setMessages(current => mergeMessage(current, message));
        });
      } catch (nextError) {
        if (isMounted) {
          setError(nextError instanceof Error ? nextError.message : 'Unable to load the community right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadState();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []));

  const isPlus = isKynoPlusPlan(profile);
  const headerAnim = useScreenEntrance(0);
  const contentAnim = useScreenEntrance(100);

  const handleSend = async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || sending) {
      return;
    }

    setSending(true);
    setError('');

    try {
      await sendCommunityMessage(trimmedDraft);
      setDraft('');
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to send your message.';
      setError(message);
      Alert.alert('Send failed', message);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <KeyboardAvoidingView style={s.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            if (isPlus) {
              scrollRef.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          <Animated.View style={[s.header, headerAnim]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[s.backText, { color: c.textSecondary }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[s.label, { color: gold[500] }]}>KYNO+ COMMUNITY</Text>
            <Text style={[s.title, { color: c.textPrimary }]}>Members Chat</Text>
            <Text style={[s.subtitle, { color: c.textSecondary }]}>
              {isPlus
                ? 'One live room for premium owners.'
                : 'Upgrade to KYNO+ to unlock the live members room.'}
            </Text>
          </Animated.View>

          <Animated.View style={contentAnim}>
          {loading ? (
            <ThemedCard lightBackgroundColor={stone[100]} style={s.loadingCard}>
              <ActivityIndicator color={c.accent} />
              <Text style={[s.loadingText, { color: c.textPrimary }]}>Loading community...</Text>
            </ThemedCard>
          ) : !isPlus ? (
            <>
              <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
                <Text style={[s.panelTitle, { color: c.textPrimary }]}>KYNO+ unlocks the members-only room</Text>
                <Text style={[s.panelText, { color: c.textSecondary }]}>
                  Premium members get one live chat for recommendations, travel planning, and thoughtful owner-to-owner advice.
                </Text>
              </ThemedCard>

              <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
                <View style={s.statusRow}>
                  <View>
                    <Text style={[s.statusLabel, { color: c.textSecondary }]}>UPGRADE STATUS</Text>
                    <Text style={[s.statusValue, { color: c.textPrimary }]}>{getUpgradeRequestStatusLabel(request)}</Text>
                  </View>
                  {request?.status ? (
                    <View style={[s.statusPill, { backgroundColor: request.status === 'pending' ? (isDark ? stone[800] : gold[50]) : request.status === 'approved' ? (isDark ? 'rgba(74,102,56,0.28)' : '#F4F7F2') : '#FEF2F2' }]}>
                      <Text style={[s.statusPillText, { color: request.status === 'declined' ? colors.emergencyAccent : c.textPrimary }]}>
                        {request.status.toUpperCase()}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[s.panelText, { color: c.textSecondary }]}>{getRequestMessage(request)}</Text>
                {request?.created_at ? (
                  <Text style={[s.metaText, { color: c.textTertiary }]}>Latest update: {formatTimestamp(request.created_at)}</Text>
                ) : null}
                <AnimatedPressable style={s.primaryBtn} onPress={() => router.push('/membership')}>
                  <Text style={s.primaryBtnText}>GO TO MEMBERSHIP</Text>
                </AnimatedPressable>
              </ThemedCard>
            </>
          ) : (
            <>
              <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
                <Text style={[s.panelText, { color: c.textSecondary }]}>
                  Use the room for recommendations, travel tips, and the kind of owner context that is better shared inside Kyno than in scattered group chats.
                </Text>
              </ThemedCard>

              {messages.length === 0 ? (
                <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
                  <Text style={[s.emptyTitle, { color: c.textPrimary }]}>No messages yet</Text>
                  <Text style={[s.panelText, { color: c.textSecondary }]}>Be the first member to start the room.</Text>
                </ThemedCard>
              ) : (
                messages.map(message => (
                  <AnimatedMessageCard key={message.id}>
                  <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.messageCard}>
                    <View style={s.messageMeta}>
                      <Text style={[s.messageAuthor, { color: c.textPrimary }]}>{message.author_label}</Text>
                      <Text style={[s.messageTime, { color: c.textTertiary }]}>{formatTimestamp(message.created_at)}</Text>
                    </View>
                    <Text style={[s.messageBody, { color: c.textSecondary }]}>{message.body}</Text>
                  </ThemedCard>
                  </AnimatedMessageCard>
                ))
              )}

              <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
                <TextInput
                  multiline
                  placeholder="Share a recommendation, ask a question, or post a helpful tip."
                  placeholderTextColor={c.textTertiary}
                  style={[s.input, { backgroundColor: isDark ? stone[800] : stone[50], borderColor: c.border, color: c.textPrimary }]}
                  value={draft}
                  onChangeText={(text) => setDraft(text.slice(0, COMMUNITY_MESSAGE_MAX_LENGTH))}
                />
                <View style={s.formFooter}>
                  <Text style={[s.metaText, { color: c.textTertiary }]}>{draft.length}/{COMMUNITY_MESSAGE_MAX_LENGTH}</Text>
                  <AnimatedPressable style={[s.primaryBtn, (!draft.trim() || sending) && s.disabledBtn]} onPress={() => void handleSend()} disabled={!draft.trim() || sending}>
                    <Text style={s.primaryBtnText}>{sending ? 'SENDING...' : 'SEND'}</Text>
                  </AnimatedPressable>
                </View>
              </ThemedCard>
            </>
          )}

          </Animated.View>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <View style={s.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 22 },
  backText: { fontFamily: fonts.sans, fontSize: 14, marginBottom: 16 },
  label: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 2.2, marginBottom: 8 },
  title: { fontFamily: fonts.serif, fontSize: 28, marginBottom: 6 },
  subtitle: { fontFamily: fonts.sansLight, fontSize: 14, lineHeight: 20 },
  loadingCard: { alignItems: 'center', marginHorizontal: 28, padding: 24 },
  loadingText: { fontFamily: fonts.serifMedium, fontSize: 18, marginTop: 12 },
  panel: { marginHorizontal: 28, marginTop: 12, padding: 18 },
  panelTitle: { fontFamily: fonts.serifMedium, fontSize: 22, marginBottom: 8 },
  panelText: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 20 },
  statusRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  statusLabel: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 1.8, marginBottom: 6 },
  statusValue: { fontFamily: fonts.serifMedium, fontSize: 18 },
  statusPill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  statusPillText: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.4 },
  metaText: { fontFamily: fonts.sans, fontSize: 11, lineHeight: 17, marginTop: 12 },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: gold[400],
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 15,
  },
  primaryBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1.8 },
  emptyTitle: { fontFamily: fonts.serifMedium, fontSize: 20, marginBottom: 8 },
  messageCard: { marginHorizontal: 28, marginTop: 10, padding: 16 },
  messageMeta: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  messageAuthor: { fontFamily: fonts.sansMedium, fontSize: 13 },
  messageTime: { fontFamily: fonts.sans, fontSize: 11 },
  messageBody: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 21 },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 112,
    padding: 14,
    textAlignVertical: 'top',
  },
  formFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 12 },
  error: { color: colors.emergencyAccent, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginHorizontal: 28, marginTop: 14 },
  disabledBtn: { opacity: 0.5 },
  bottomSpace: { height: 28 },
});
