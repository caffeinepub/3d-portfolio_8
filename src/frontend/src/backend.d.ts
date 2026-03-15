import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SocialLink {
    url: string;
    platform: string;
}
export interface Portfolio {
    about: string;
    tagline: string;
    socialLinks: Array<SocialLink>;
    name: string;
    skills: Array<string>;
}
export interface Resume {
    blob: ExternalBlob;
    fileName: string;
}
export interface Project {
    id: bigint;
    title: string;
    link: string;
    description: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProject(title: string, description: string, link: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProject(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPortfolio(): Promise<Portfolio>;
    getProjects(): Promise<Array<Project>>;
    getResume(): Promise<Resume>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializePortfolio(name: string, tagline: string, about: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePortfolio(name: string, tagline: string, about: string): Promise<void>;
    updateProject(id: bigint, title: string, description: string, link: string): Promise<void>;
    updateSkills(skills: Array<string>): Promise<void>;
    updateSocialLinks(links: Array<SocialLink>): Promise<void>;
    uploadResume(fileName: string, blob: ExternalBlob): Promise<void>;
}
