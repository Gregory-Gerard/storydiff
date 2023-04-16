export default function Page({ params: { appId, testId } }: { params: { appId: string; testId: string } }) {
  return appId + '-' + testId;
}
