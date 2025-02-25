import { Room, VideoPresets, Track } from 'livekit-client';

interface LiveKitMeetingData {
    id: string;
    name: string;
    token: string;
    createdBy: string;
    isActive: boolean;
    maxParticipants: number;
    expiresAt: string;
    settings: {
        allowChat: boolean;
        allowVideo: boolean;
        allowAudio: boolean;
        requireApproval: boolean;
    };
}

export function createRoom() {
    return new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
        },
    });
}

export async function connectToRoom(room: Room, meetingData: LiveKitMeetingData): Promise<void> {
    
    // Pre-warm connection
    await room.prepareConnection('ws://127.0.0.1:7880', meetingData.token);
    
    // Connect with auto-subscribe enabled
    await room.connect('ws://127.0.0.1:7880', meetingData.token, {
        autoSubscribe: true
    });
    
    return new Promise((resolve) => {
        if (room.state === 'connected') {
            resolve();
        } else {
            room.once('connected', () => resolve());
        }
    });
}

export function attachTrack(track: Track, elementId: string) {
    const element = track.attach();
    if (element instanceof HTMLVideoElement) {
        element.autoplay = true;
        element.playsInline = true;
        element.muted = true;
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.objectFit = 'cover';
    }
    
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = '';
        container.appendChild(element);
    }
    return element;
}

export function detachTrack(track: Track) {
    track.detach();
}
