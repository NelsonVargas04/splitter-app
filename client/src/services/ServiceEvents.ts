import Backend from '@/services/Backend';
import {
  Event,
  EventSummary,
  EventParticipant,
  ApiResponse,
  GroupIconType,
} from '@/models/domain';

interface CreateEventData {
  name: string;
  icon: GroupIconType;
  iconBgColor: string;
  groupId?: number;
  total: number;
  participantIds: number[];
}

const ServiceEvents = {
  async fetchRecent(limit: number = 10): Promise<Event[]> {
    return Backend.get<Event[]>(`/events/recent?limit=${limit}`);
  },

  async fetchEvent(id: number): Promise<Event> {
    return Backend.get<Event>(`/events/${id}`);
  },

  async fetchEventSummary(id: number): Promise<EventSummary> {
    return Backend.get<EventSummary>(`/events/${id}/summary`);
  },

  async fetchEventParticipants(id: number): Promise<EventParticipant[]> {
    return Backend.get<EventParticipant[]>(`/events/${id}/participants`);
  },

  async createEvent(data: CreateEventData): Promise<Event> {
    return Backend.post<Event>('/events', data);
  },

  async updateEvent(id: number, data: Partial<CreateEventData>): Promise<Event> {
    return Backend.put<Event>(`/events/${id}`, data);
  },

  async deleteEvent(id: number): Promise<void> {
    return Backend.delete(`/events/${id}`);
  },

  async remindPending(eventId: number): Promise<ApiResponse> {
    return Backend.post<ApiResponse>(`/events/${eventId}/remind`);
  },

  async markParticipantPaid(eventId: number, participantId: number): Promise<EventParticipant> {
    return Backend.put<EventParticipant>(`/events/${eventId}/participants/${participantId}/pay`);
  },

  async settleEvent(eventId: number): Promise<Event> {
    return Backend.put<Event>(`/events/${eventId}/settle`);
  },

  async parseBillQR(qrData: string): Promise<ApiResponse<{ total: number; items?: string[] }>> {
    return Backend.post<ApiResponse<{ total: number; items?: string[] }>>('/bills/parse', { qrData });
  },
};

export default ServiceEvents;
