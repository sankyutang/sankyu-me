export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Route groups provide the document shell: (site) and (payload) each render
  // their own <html>/<body> (Payload via RootLayout). A single root <html>
  // would nest invalid markup under /admin.
  return children;
}
