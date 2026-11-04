import { redirect } from "next/navigation";

export default async function SubjectRedirectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  redirect(`/annotated-ncert?subject=${encodeURIComponent(subject)}`);
}
