"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../../context/ThemeContext";
import { HiXMark } from 'react-icons/hi2';

const plans = [
	{
		name: "Personal",
		description:
			"Great for steady personal use with rollover and solid credit limits.",
		price: 19,
		color: "text-pink-500",
		button: "Upgrade Plan",
		buttonColor: "bg-pink-500 text-white hover:bg-pink-600",
		border: "border-pink-200",
		additionalCredits: "$0.20",
		isCurrent: false,
		features: ["200 credits per month", "Users: N/A"],
	},
	{
		name: "Family",
		description:
			"Flexible plan for families or small teams with shared credits.",
		price: 39,
		color: "text-yellow-500",
		button: "Upgrade Plan",
		buttonColor: "bg-yellow-400 text-white hover:bg-yellow-500",
		border: "border-yellow-200",
		isCurrent: false,
		features: ["500 credits per month", "Users: 4"],
	},
	{
		name: "Family Plus",
		description:
			"A solid starting point for businesses with scalable credits.",
		price: 99,
		color: "text-blue-500",
		button: "Current Plan",
		buttonColor:
			"bg-white text-blue-500 border border-blue-500 cursor-default",
		border: "border-blue-400",
		isCurrent: true,
		features: ["1500 credits per month", "Users: 6"],
	},
];

const businessPlans = [
	{
		name: "Launch",
		description:
			"Ideal for starting your teams needing more credits, storage and BYOK.",
		price: 99,
		color: "text-red-500",
		button: "Upgrade Plan",
		buttonColor: "bg-red-500 text-white hover:bg-red-600",
		border: "border-red-200",
		features: ["1500 credits per month", "Users: 6"],
	},
	{
		name: "Growth",
		description:
			"Ideal for growing teams needing more credits, storage and BYOK.",
		price: 299,
		color: "text-purple-500",
		button: "Upgrade Plan",
		buttonColor: "bg-purple-500 text-white hover:bg-purple-600",
		border: "border-purple-200",
		features: [
			"5000 credits per month",
			"Users: unlimited (includes free 50 personal credits, up to 20 users)",
		],
	},
	{
		name: "Pro",
		description:
			"Full-featured plan for pro teams with max credits, storage and BYOK.",
		price: 699,
		color: "text-orange-500",
		button: "Upgrade Plan",
		buttonColor: "bg-orange-500 text-white hover:bg-orange-600",
		border: "border-orange-200",
		features: [
			"15000 credits per month",
			"Users: unlimited (includes free 50 personal credits, up to 40 users)",
		],
	},
	{
		name: "Human Digital Manager",
		description:
			"Full-featured plan for pro teams with max credits, storage and BYOK.",
		price: 2500,
		color: "text-cyan-500",
		button: "Upgrade Plan",
		buttonColor: "bg-cyan-500 text-white hover:bg-cyan-600",
		border: "border-cyan-200",
		features: [
			"50000 credits per month",
			"Users: unlimited (includes free 50 personal credits, up to 40 users)",
		],
	},
	{
		name: "Founder's Club",
		description: "Exclusive plan for local small business owners.",
		price: 2500,
		color: "text-teal-500",
		button: "Upgrade Plan",
		buttonColor:
			"bg-gradient-to-r from-teal-400 to-green-400 text-white hover:from-teal-500 hover:to-green-500",
		border: "border-teal-200",
		features: [
			"+20% Bonus Credits for Life",
			"Access to Community & Training",
			"Early Feature Access & Direct Feedback Loop",
			"Locked Pricing - No Future Increase",
		],
	},
];

export default function PlanSelectionPage() {
	const router = useRouter();
	const { isDarkMode, toggleDarkMode } = useTheme();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
	const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [tab, setTab] = useState("Personal");

	// Cancel subscription modal state
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [cancelReason, setCancelReason] = useState<string | null>(null);
	const [cancelFeedback, setCancelFeedback] = useState("");

	// New state for the new modal
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<any>(null);
	const [actionType, setActionType] = useState<'upgrade' | 'downgrade' | null>(null);

	// Function to handle plan selection
	const handlePlanSelect = (plan: any) => {
		const currentPlan = (tab === 'Personal' ? plans : businessPlans).find((p: any) => p.isCurrent);
		const currentPlanOrder = getPlanOrder(currentPlan?.name || '');
		const selectedPlanOrder = getPlanOrder(plan.name);

		setSelectedPlan(plan);
		setActionType(selectedPlanOrder > currentPlanOrder ? 'upgrade' : 'downgrade');
		setShowConfirmModal(true);
	};

	// Function to confirm plan change
	const confirmPlanChange = () => {
		// Here you would implement the actual plan change logic
		console.log('Changing plan to:', selectedPlan);
		setShowConfirmModal(false);
		router.push('/billing'); // Redirect back to billing page
	};

	// Function to handle subscription cancellation
	const handleCancelSubscription = () => {
		// Here you would implement the actual cancellation logic
		console.log("Cancellation details:", {
			reason: cancelReason,
			feedback: cancelFeedback,
		});
		setShowCancelModal(false);
		router.push('/billing'); // Redirect back to billing page
	};

	// Helper to determine plan order
	const getPlanOrder = (planName: string) => {
		const order = [
			'Personal',
			'Family',
			'Family Plus',
			'Launch',
			'Growth',
			'Pro',
			"Human Digital Manager",
			"Founder's Club"
		];
		return order.indexOf(planName);
	};

	const currentPlan = (tab === 'Personal' ? plans : businessPlans).find((p: any) => p.isCurrent);
	const currentPlanOrder = getPlanOrder(currentPlan?.name || '');

	return (
		<div
			className={`min-h-screen ${
				isDarkMode
					? "bg-gray-900 text-gray-100"
					: "bg-gray-50 text-gray-900"
			} flex font-poppins transition-colors duration-300`}
		>
			<Sidebar
				isDarkMode={isDarkMode}
				toggleDarkMode={toggleDarkMode}
				isSidebarCollapsed={isSidebarCollapsed}
				setIsSidebarCollapsed={setIsSidebarCollapsed}
				isNaviModalOpen={isNaviModalOpen}
				setIsNaviModalOpen={setIsNaviModalOpen}
				isNaviDropdownOpen={isNaviDropdownOpen}
				setIsNaviDropdownOpen={setIsNaviDropdownOpen}
				isProfileOpen={isProfileOpen}
				setIsProfileOpen={setIsProfileOpen}
				isNaviChatbotOpen={false}
				setIsNaviChatbotOpen={function (value: React.SetStateAction<boolean>): void {
					throw new Error("Function not implemented.");
				}}
			/>
			<div className={`flex-1 p-10 max-w-6xl mx-auto`}>
				<button
					onClick={() => router.back()}
					className="text-gray-500 hover:text-gray-700 text-base font-medium mb-1"
				>
					&lt; Back
				</button>
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-2xl font-bold">Billing & Subscription</h1>					<button 
						onClick={() => setShowCancelModal(true)}
						className="bg-red-500 text-white px-5 py-2 rounded font-medium hover:bg-red-600"
					>
						Cancel Subscription
					</button>
				</div>
				<div className="mb-8 text-sm text-gray-500">
					<span
						className="text-blue-600 cursor-pointer hover:underline"
						onClick={() => router.push("/billing")}
					>
						Billing & Subscription
					</span>
					<span className="mx-1">&gt;</span>
					<span
						className="text-blue-600 cursor-pointer hover:underline"
						onClick={() => router.push("/billing/plan")}
					>
						Your Plan
					</span>
				</div>
				<div className="flex gap-2 mb-8">
					<button
						className={`px-5 py-2 rounded font-medium text-base ${
							tab === "Personal"
								? "bg-teal-500 text-white"
								: "bg-white text-gray-500 border border-gray-200"
						}`}
						onClick={() => setTab("Personal")}
					>
						Personal
					</button>
					<button
						className={`px-5 py-2 rounded font-medium text-base ${
							tab === "Business"
								? "bg-teal-500 text-white"
								: "bg-white text-gray-500 border border-gray-200"
						}`}
						onClick={() => setTab("Business")}
					>
						Business
					</button>
				</div>
				<div className="flex flex-col md:flex-row gap-6 flex-wrap">
					{(tab === "Personal" ? plans : businessPlans).map((plan, idx) => {
						const isCurrent = (plan as any).isCurrent ?? false;
						return (
							<div
								key={idx}
								className={`flex-1 min-w-[300px] max-w-[400px] rounded-2xl border ${
									isCurrent ? plan.border : "border-gray-200"
								} p-6 flex flex-col`}
							>
								<div className="flex-1">
									<h3 className={`text-xl font-bold ${plan.color} mb-2`}>
										{plan.name}
									</h3>
									<p className="text-gray-500 mb-4">{plan.description}</p>
									<div className="mb-4">
										<span className="text-3xl font-bold">${plan.price}</span>
										<span className="text-gray-500">/month</span>
									</div>
									<ul className="space-y-2 mb-6">
										{plan.features.map((feature, idx) => (
											<li key={idx} className="flex items-start">
												<svg
													className="w-5 h-5 text-green-500 mr-2 mt-0.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
												<span className="text-gray-600">{feature}</span>
											</li>
										))}
									</ul>
								</div>
								<button
									className={`w-full py-2 rounded-lg font-medium ${
										isCurrent
											? plan.buttonColor
											: plan.color.replace('text-', 'bg-') + ' text-white hover:opacity-90'
									}`}
									onClick={() => !isCurrent && handlePlanSelect(plan)}
									disabled={isCurrent}
								>
									{isCurrent ? "Current Plan" : "Upgrade Plan"}
								</button>
							</div>
						);
					})}
				</div>
			</div>			
      {/* Cancel Subscription Modal */}
			{showCancelModal && (
				<div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex justify-center items-center z-50`}>
					<div
						className={`w-full max-w-lg ${
							isDarkMode
								? "bg-gray-800 text-white"
								: "bg-white text-gray-900"
						} rounded-2xl shadow-xl overflow-hidden`}
					>
						<div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
							<h2 className="text-xl font-semibold">Cancel Subscription</h2>
							<button
								onClick={() => setShowCancelModal(false)}
								className={`p-1 rounded-full ${
									isDarkMode
										? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
										: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
								} transition-colors`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="p-6">
							<p
								className={`mb-6 text-base ${
									isDarkMode ? "text-gray-300" : "text-gray-700"
								}`}
							>
								We're sorry to see you go. Your subscription will remain active
								until the end of your current billing period.
							</p>

							<div className="space-y-6">
								<div>
									<p
										className={`mb-3 text-base ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Why are you canceling? (Optional)
									</p>
									<div className="space-y-2">
										{[
											"Too expensive",
											"Not using it enough",
											"Found a better alternative",
											"Technical issues",
											"No longer need the service",
											"Other",
										].map((reason) => (
											<div key={reason} className="flex items-center">
												<input
													type="radio"
													id={reason}
													name="cancelReason"
													className="h-4 w-4 text-teal-500"
													checked={cancelReason === reason}
													onChange={() => setCancelReason(reason)}
												/>
												<label
													htmlFor={reason}
													className={`ml-3 ${
														isDarkMode ? "text-gray-300" : "text-gray-700"
													}`}
												>
													{reason}
												</label>
											</div>
										))}
									</div>
								</div>

								<div>
									<p
										className={`mb-3 text-base ${
											isDarkMode ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Additional feedback (Optional)
									</p>
									<textarea
										value={cancelFeedback}
										onChange={(e) => setCancelFeedback(e.target.value)}
										placeholder="Help us improve by sharing your thoughts..."
										className={`w-full p-3 border rounded-lg resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
											isDarkMode
												? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
												: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
										}`}
									/>
								</div>
							</div>

							<div className="flex justify-end space-x-3 mt-8">
								<button
									onClick={() => setShowCancelModal(false)}
									className={`px-6 py-2 rounded-lg font-medium ${
										isDarkMode
											? "bg-gray-700 text-white hover:bg-gray-600"
											: "bg-gray-100 text-gray-800 hover:bg-gray-200"
									}`}
								>
									Keep My Subscription
								</button>
								<button
									onClick={handleCancelSubscription}
									className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
								>
									Cancel Subscription
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Plan Change Confirmation Modal */}
			{showConfirmModal && selectedPlan && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
					<div className={`w-full max-w-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-xl overflow-hidden`}>
						<div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
							<h2 className="text-2xl font-bold">
								{actionType === 'downgrade' ? 'Confirm Downgrade Subscription' : 'Confirm Upgrade Subscription'}
							</h2>
							<button
								onClick={() => setShowConfirmModal(false)}
								className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
							>
								<HiXMark className="w-6 h-6" />
							</button>
						</div>
						<div className="p-6">
							<p className={`mb-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
								You're about to {actionType === 'downgrade' ? 'downgrade' : 'upgrade'} to the <span className="font-semibold" style={{ color: actionType === 'upgrade' ? '#F59E42' : '#F59E42' }}>{selectedPlan.name} Plan</span>
							</p>
							<div className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-cyan-900 bg-opacity-30' : 'bg-cyan-50'}`}> 
								<div className="flex flex-col gap-2 text-base">
									<div className="flex justify-between"><span className="font-medium">New Plan:</span> <span>{selectedPlan.name}</span></div>
									<div className="flex justify-between"><span className="font-medium">Billing:</span> <span>${selectedPlan.price}/month</span></div>
									<div className="flex justify-between"><span className="font-medium">Effective:</span> <span>Immediately</span></div>
								</div>
							</div>
							<p className={`mb-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your new subscription will be activated immediately and you'll be charged a prorate amount for the current billing period.</p>
							<div className="flex justify-end gap-3">
								<button
									onClick={() => setShowConfirmModal(false)}
									className={`px-6 py-2 rounded-lg font-medium border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
								>
									Cancel
								</button>
								<button
									onClick={confirmPlanChange}
									className={`px-6 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
								>
									{actionType === 'downgrade' ? 'Confirm Downgrade' : 'Confirm Upgrade'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}