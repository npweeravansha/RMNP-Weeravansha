export interface VoicePersona {
  id: string;
  nameSi: string;
  nameEn: string;
  geminiVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';
  gender: 'female' | 'male';
  tag: string;
  descriptionSi: string;
  descriptionEn: string;
  samplePhrase: string;
  color: string;
}

export interface ToneStyle {
  id: string;
  labelSi: string;
  labelEn: string;
  description: string;
  instruction: string;
}

export interface AudioTake {
  id: string;
  title: string;
  scriptText: string;
  voiceName: string;
  styleName: string;
  audioUrl: string;
  base64Data: string;
  duration: number;
  createdAt: number;
  playbackSpeed: number;
}
