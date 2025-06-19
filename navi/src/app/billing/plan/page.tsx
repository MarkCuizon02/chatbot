"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from '@/context/ThemeContext';
import { useSubscription, Plan } from '@/context/SubscriptionContext';
import Sidebar from '@/app/components/Sidebar';
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiOutlineCheck, HiOutlineStar, HiOutlineUsers } from "react-icons/hi2";
import { TrendingUp, TrendingDown, Crown, Sparkles, Zap } from "lucide-react";
import SuccessNotification from '@/app/components/SuccessNotification';

const plans: Plan[] = [
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
		category: 'Personal'
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
		category: 'Personal'
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
		category: 'Personal'
	},
];

const businessPlans: Plan[] = [
	{
		name: "Launch",
		description:
			"Ideal for starting your teams needing more credits, storage and BYOK.",
		price: 99,
		color: "text-red-500",
		button: "Upgrade Plan",
		buttonColor: "bg-red-500 text-white hover:bg-red-600",
		border: "border-red-200",
		isCurrent: false,
		features: ["1500 credits per month", "Users: 6"],
		category: 'Business'
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
		isCurrent: false,
		features: [
			"5000 credits per month",
			"Users: unlimited",
		],
		category: 'Business'
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
		isCurrent: false,
		features: [
			"15000 credits per month",
			"Users: unlimited",
		],
		category: 'Business'
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
		isCurrent: false,
		features: [
			"50000 credits per month",
			"Users: unlimited ",
		],
		category: 'Business'
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
		isCurrent: false,
		features: [
			"+20% Bonus Credits for Life",
			"Access to Community & Training",
			"Early Feature Access & Direct Feedback Loop",
			"Locked Pricing - No Future Increase",
		],
		category: 'Business'
	},
];

export default function PlanSelectionPage() {
	const router = useRouter();
	const { isDarkMode, toggleDarkMode } = useTheme();
	const { subscription, updatePlan, addBillingRecord } = useSubscription();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
	const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [tab, setTab] = useState("Personal");

	// Cancel subscription modal state
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [cancelReason, setCancelReason] = useState<string | null>(null);
	const [cancelFeedback, setCancelFeedback] = useState("");

	// Plan change modal state
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [actionType, setActionType] = useState<'upgrade' | 'downgrade' | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showSuccessNotification, setShowSuccessNotification] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5
			}
		}
	};

	const cardVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.3
			}
		},
		hover: {
			scale: 1.02,
			transition: {
				duration: 0.2
			}
		}
	};

	// Add this line near your other `useState` hooks in the `PlanSelectionPage` component
	const [isLoading, setIsLoading] = useState(false);

	// Function to handle subscription cancellation
	const handleCancelSubscription = async () => {
		setIsLoading(true);
		setShowCancelModal(false);
		// You might want to show a confirmation message or redirect the user
	};

	// Function to handle plan change
	const handlePlanChange = async () => {
		if (!selectedPlan) return;
		
		setIsProcessing(true);
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Update the plan in context
		updatePlan(selectedPlan);
		
		// Add billing record
		const newBillingRecord = {
			id: `#${Math.floor(Math.random() * 90000) + 10000}`,
			plan: selectedPlan.name,
			date: new Date().toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}),
			status: 'Paid' as const,
			amount: selectedPlan.price,
			type: 'plan' as const
		};
		
		addBillingRecord(newBillingRecord);
		
		setIsProcessing(false);
		setShowConfirmModal(false);
		
		// Show success message
		setSuccessMessage(`Successfully ${actionType === 'upgrade' ? 'upgraded' : 'downgraded'} to ${selectedPlan.name} plan!`);
		setShowSuccessNotification(true);
		
		// Redirect after a short delay
		setTimeout(() => {
			router.push('/billing');
		}, 1000);
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

	const currentPlan = subscription.currentPlan;
	const currentPlanOrder = getPlanOrder(currentPlan?.name || '');

	const getCurrentPlans = () => {
		const allPlans = [...plans, ...businessPlans];
		return allPlans.map(plan => ({
			...plan,
			isCurrent: plan.name === currentPlan?.name
		}));
	};

	const filteredPlans = getCurrentPlans().filter(plan => 
		tab === "Personal" ? plan.category === 'Personal' : plan.category === 'Business'
	);

	const getFeatureIcon = (feature: string) => {
		if (feature.includes('credits')) return <Zap className="w-4 h-4" />;
		if (feature.includes('Users')) return <HiOutlineUsers className="w-4 h-4" />;
		if (feature.includes('Bonus')) return <Sparkles className="w-4 h-4" />;
		if (feature.includes('Community')) return <HiOutlineStar className="w-4 h-4" />;
		return <HiOutlineCheck className="w-4 h-4" />;
	};

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
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className={`flex-1 p-10 max-w-7xl mx-auto`}
				>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.button
							variants={itemVariants}
							onClick={() => router.back()}
							className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-base font-medium mb-1 transition-colors`}
						>
							&lt; Back
						</motion.button>
						
						<motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
							<h1 className="text-3xl font-bold">Billing & Subscription</h1>
							<motion.button 
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setShowCancelModal(true)}
								className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
							>
								Cancel Subscription
							</motion.button>
						</motion.div>

						<motion.div variants={itemVariants} className="mb-8 text-sm text-gray-500">
							<span
								className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:underline`}
								onClick={() => router.push("/billing")}
							>
								Billing & Subscription
							</span>
							<span className="mx-1">&gt;</span>
							<span
								className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:underline`}
								onClick={() => router.push("/billing/plan")}
							>
								Your Plan
							</span>
						</motion.div>

						<motion.div variants={itemVariants} className="flex gap-2 mb-8">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`px-6 py-3 rounded-lg font-medium text-base transition-all ${
									tab === "Personal"
										? isDarkMode 
											? "bg-gray-700 text-gray-100" 
											: "bg-gray-200 text-gray-900"
										: isDarkMode
											? "bg-gray-800 text-gray-400 border border-gray-700"
											: "bg-white text-gray-500 border border-gray-200"
								}`}
								onClick={() => setTab("Personal")}
							>
								Personal
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`px-6 py-3 rounded-lg font-medium text-base transition-all ${
									tab === "Business"
										? isDarkMode 
											? "bg-gray-700 text-gray-100" 
											: "bg-gray-200 text-gray-900"
										: isDarkMode
											? "bg-gray-800 text-gray-400 border border-gray-700"
											: "bg-white text-gray-500 border border-gray-200"
								}`}
								onClick={() => setTab("Business")}
							>
								Business
							</motion.button>
						</motion.div>

						<motion.div 
							variants={itemVariants}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-wrap"
						>
							{filteredPlans.map((plan, idx) => {
								const isCurrent = plan.isCurrent;
								const planOrder = getPlanOrder(plan.name);
								const isUpgrade = planOrder > currentPlanOrder;
								const isDowngrade = planOrder < currentPlanOrder;
								
								return (
									<motion.div
										key={plan.name}
										variants={cardVariants}
										whileHover="hover"
										className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl border ${
											plan.border
										} shadow-lg p-8 flex flex-col items-center relative min-w-[320px] max-w-[420px] ${
											isCurrent ? "ring-2 ring-blue-200 dark:ring-blue-600" : ""
										} transition-all duration-300`}
										style={{ flexBasis: "calc(33% - 1.5rem)" }}
									>
										{plan.name === "Founder's Club" && (
											<motion.div
												initial={{ rotate: 0 }}
												animate={{ rotate: 360 }}
												transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
												className="absolute -top-3 -right-3"
											>
												<Crown className="w-6 h-6 text-yellow-500" />
											</motion.div>
										)}
										
										<div className={`text-xl font-bold mb-2 ${plan.color} flex items-center gap-2`}>
											{plan.name}
											{isCurrent && <HiOutlineCheck className="w-5 h-5 text-green-500" />}
										</div>
										
										<div className={`text-sm mb-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
											{plan.description}
										</div>
										
										<div className={`text-4xl font-bold mb-2 ${plan.color} flex items-center gap-2`}>
											${plan.price}
											<span className="text-lg font-medium text-gray-500">/month</span>
										</div>

										{isUpgrade && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												className="flex items-center gap-1 text-green-600 text-sm mb-3"
											>
												<TrendingUp className="w-4 h-4" />
												Upgrade
											</motion.div>
										)}

										{isDowngrade && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												className="flex items-center gap-1 text-orange-600 text-sm mb-3"
											>
												<TrendingDown className="w-4 h-4" />
												Downgrade
											</motion.div>
										)}

										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className={`mt-4 w-full py-3 rounded-lg font-semibold text-base transition-all ${
												isCurrent
													? 'bg-gray-100 text-gray-500 cursor-not-allowed'
													: plan.buttonColor
											}`}
											disabled={isCurrent}
											onClick={() => {
												if (!isCurrent) {
													setActionType(isDowngrade ? 'downgrade' : 'upgrade');
													setSelectedPlan(plan);
													setShowConfirmModal(true);
												}
											}}
										>
											{isCurrent
												? 'Current Plan'
												: isDowngrade
												? 'Downgrade Plan'
												: 'Upgrade Plan'}
										</motion.button>

										<ul className="mt-6 w-full text-sm space-y-3">
											{plan.features?.map((feature: string, i: number) => (
												<motion.li
													key={i}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: i * 0.1 }}
													className="flex items-center gap-3"
												>
													<div className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
														{getFeatureIcon(feature)}
													</div>
													<span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
														{feature}
													</span>
												</motion.li>
											))}
										</ul>
									</motion.div>
								);
							})}
						</motion.div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
			
			{/* Cancel Subscription Modal */}
			<AnimatePresence>
				{showCancelModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className={`w-full max-w-lg ${
								isDarkMode
									? "bg-gray-800 text-white"
									: "bg-white text-gray-900"
							} rounded-2xl shadow-xl overflow-hidden`}
						>
							<div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
								<h2 className="text-xl font-semibold">Cancel Subscription</h2>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowCancelModal(false)}
									className={`p-1 rounded-full ${
										isDarkMode
											? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
											: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
									} transition-colors`}
								>
									<HiXMark className="w-5 h-5" />
								</motion.button>
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
												<motion.div 
													key={reason} 
													className="flex items-center"
													whileHover={{ x: 5 }}
												>
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
														className={`ml-3 cursor-pointer ${
															isDarkMode ? "text-gray-300" : "text-gray-700"
														}`}
													>
														{reason}
													</label>
												</motion.div>
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
											placeholder="Help us improve by sharing your thoughts..."
											value={cancelFeedback}
											onChange={(e) => setCancelFeedback(e.target.value)}
											className={`w-full p-3 border rounded-lg resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
												isDarkMode
													? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
													: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
											}`}
										/>
									</div>
								</div>

								<div className="flex justify-end space-x-3 mt-8">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setShowCancelModal(false)}
										className={`px-6 py-2 rounded-lg font-medium ${
											isDarkMode
												? "bg-gray-700 text-white hover:bg-gray-600"
												: "bg-gray-100 text-gray-800 hover:bg-gray-200"
										}`}
									>
										Keep My Subscription
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleCancelSubscription}
										className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
									>
										Cancel Subscription
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Confirm Plan Change Modal */}
			<AnimatePresence>
				{showConfirmModal && selectedPlan && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className={`w-full max-w-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-xl overflow-hidden`}
						>
							<div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
								<h2 className="text-2xl font-bold">
									{actionType === 'downgrade' ? 'Confirm Downgrade Subscription' : 'Confirm Upgrade Subscription'}
								</h2>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowConfirmModal(false)}
									className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
								>
									<HiXMark className="w-6 h-6" />
								</motion.button>
							</div>
							<div className="p-6">
								<p className={`mb-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
									You're about to {actionType === 'downgrade' ? 'downgrade' : 'upgrade'} to the <span className="font-semibold" style={{ color: actionType === 'upgrade' ? '#F59E42' : '#F59E42' }}>{selectedPlan.name} Plan</span>
								</p>
								<motion.div 
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-cyan-900 bg-opacity-30' : 'bg-cyan-50'}`}
								> 
									<div className="flex flex-col gap-2 text-base">
										<div className="flex justify-between"><span className="font-medium">New Plan:</span> <span>{selectedPlan.name}</span></div>
										<div className="flex justify-between"><span className="font-medium">Billing:</span> <span>${selectedPlan.price}/month</span></div>
										<div className="flex justify-between"><span className="font-medium">Effective:</span> <span>Immediately</span></div>
									</div>
								</motion.div>
								<p className={`mb-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your new subscription will be activated immediately and you'll be charged a prorate amount for the current billing period.</p>
								<div className="flex justify-end gap-3">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setShowConfirmModal(false)}
										className={`px-6 py-2 rounded-lg font-medium border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handlePlanChange}
										disabled={isProcessing}
										className={`px-6 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-teal-500 text-white hover:bg-teal-600'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
									>
										{isProcessing ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
												className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
											/>
										) : (
											`${actionType === 'downgrade' ? 'Confirm Downgrade' : 'Confirm Upgrade'}`
										)}
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			
			{/* Success Notification */}
			<SuccessNotification
				isVisible={showSuccessNotification}
				message={successMessage}
				onClose={() => setShowSuccessNotification(false)}
			/>
		</div>
	);
}