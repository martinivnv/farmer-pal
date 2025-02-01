import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const posts = [
	{
		id: "1",
		title: "Unusual Leaf Spots in Maize",
		author: "John Doe",
		avatar: "/avatars/01.png",
		content:
			"I've noticed some strange spots on my maize leaves. Has anyone else experienced this?",
		date: "2023-04-01",
	},
	{
		id: "2",
		title: "Pest Control for Organic Tomatoes",
		author: "Jane Smith",
		avatar: "/avatars/02.png",
		content:
			"Looking for eco-friendly pest control methods for my organic tomato garden. Any suggestions?",
		date: "2023-04-02",
	},
	{
		id: "3",
		title: "Water Management in Rice Paddies",
		author: "Bob Johnson",
		avatar: "/avatars/03.png",
		content:
			"Struggling with water management in my rice paddies. How often should I be flooding the fields?",
		date: "2023-04-03",
	},
];

export default function CommunityPage() {
	return (
		<div className="space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Community</h2>
			<div className="grid gap-4">
				{posts.map((post) => (
					<Card key={post.id}>
						<CardHeader>
							<div className="flex items-center gap-4">
								<Avatar>
									<AvatarImage src={post.avatar} alt={post.author} />
									<AvatarFallback>{post.author[0]}</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle>{post.title}</CardTitle>
									<CardDescription>
										{post.author} - {post.date}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p>{post.content}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
