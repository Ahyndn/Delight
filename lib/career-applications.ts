export const APPLICATIONS_KEY = "Delight-career-applications";

export type CareerApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  coverLetter: string;
  resumeName: string;
  resumeType: string;
  resumeDataUrl: string;
  submittedAt: string;
  status: "received";
};

export function getApplications(): CareerApplication[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = sessionStorage.getItem(APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveApplication(
  application: CareerApplication
): void {
  const applications = getApplications();

  sessionStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify([application, ...applications])
  );
}

export function deleteApplication(id: string): void {
  const remaining = getApplications().filter(
    (application) => application.id !== id
  );

  sessionStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify(remaining)
  );
}

export function clearApplications(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(APPLICATIONS_KEY);
}