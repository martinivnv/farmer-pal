import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "AgriHealth Dashboard",
	description: "AI-powered crop health management",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="dark">
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<SidebarProvider>{children}</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
