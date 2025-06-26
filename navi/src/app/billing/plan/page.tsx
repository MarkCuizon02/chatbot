"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from '@/context/ThemeContext';
import { useSubscription, Plan } from '@/context/SubscriptionContext';
import Sidebar from '@/app/components/Sidebar';
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiOutlineCheck, HiOutlineStar, HiOutlineUsers, HiOutlineUser, HiOutlineBuildingOffice2 } from "react-icons/hi2";
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
	const [showReactivateModal, setShowReactivateModal] = useState(false);
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
		
		try {
			console.log('🔍 Client: Sending cancel subscription request:', {
				userId: 1,
				reason: cancelReason,
				feedback: cancelFeedback
			});

			// Call the API to cancel the subscription
			const response = await fetch('/api/subscription/cancel', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: 1, // TODO: Get actual user ID from auth context
					reason: cancelReason,
					feedback: cancelFeedback
				}),
			});

			console.log('📦 Client: Cancel API response status:', response.status);

			const result = await response.json();
			console.log('📦 Client: Cancel API response body:', result);

			if (!response.ok) {
				// Handle specific error cases
				if (result.error === 'Subscription is already canceled') {
					setSuccessMessage('Your subscription is already canceled. You can reactivate anytime!');
					setShowSuccessNotification(true);
					setShowCancelModal(false);
					setCancelReason(null);
					setCancelFeedback('');
					return;
				}
				throw new Error(`API Error: ${result.error || 'Unknown error'} - ${result.details || ''}`);
			}

			// Update the subscription context to show no current plan
			const canceledPlan = {
				name: "No Active Plan",
				description: "Your subscription has been canceled. You can reactivate anytime.",
				price: 0,
				color: "text-gray-500",
				button: "Reactivate",
				buttonColor: "bg-gray-500 text-white hover:bg-gray-600",
				border: "border-gray-200",
				isCurrent: true,
				features: ["Access until end of billing period", "Can reactivate anytime"],
				category: 'Personal' as const
			};

			// Update the plan in context to show canceled state
			updatePlan(canceledPlan);

			// Show success message
			setSuccessMessage(result.message || 'Subscription canceled successfully!');
			setShowSuccessNotification(true);

			// Close the modal
			setShowCancelModal(false);
			setCancelReason(null);
			setCancelFeedback('');

			// Redirect back to plan page after a short delay
			setTimeout(() => {
				router.push('/billing/plan');
			}, 2000);

		} catch (error) {
			console.error('❌ Client: Error canceling subscription:', error);
			setSuccessMessage(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
			setShowSuccessNotification(true);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to handle subscription reactivation
	const handleReactivateSubscription = async (planName: string) => {
		setIsProcessing(true);
		
		try {
			console.log('🔍 Client: Sending reactivate subscription request:', {
				userId: 1,
				planName: planName
			});

			// Call the API to reactivate the subscription
			const response = await fetch('/api/subscription/reactivate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: 1, // TODO: Get actual user ID from auth context
					planName: planName
				}),
			});

			console.log('📦 Client: Reactivate API response status:', response.status);

			const result = await response.json();
			console.log('📦 Client: Reactivate API response body:', result);

			if (!response.ok) {
				throw new Error(`API Error: ${result.error || 'Unknown error'} - ${result.details || ''}`);
			}

			// Find the plan object to update the context
			const allPlans = [...plans, ...businessPlans];
			const reactivatedPlan = allPlans.find(plan => plan.name === planName);

			if (reactivatedPlan) {
				// Update the plan in context
				updatePlan(reactivatedPlan);
			}

			// Show success message
			setSuccessMessage(result.message || 'Subscription reactivated successfully!');
			setShowSuccessNotification(true);

			// Redirect back to plan page after a short delay
			setTimeout(() => {
				router.push('/billing/plan');
			}, 2000);

		} catch (error) {
			console.error('❌ Client: Error reactivating subscription:', error);
			setSuccessMessage(`Failed to reactivate subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
			setShowSuccessNotification(true);
		} finally {
			setIsProcessing(false);
		}
	};

	// Function to handle plan change
	const handlePlanChange = async () => {
		if (!selectedPlan) return;
		
		setIsProcessing(true);
		
		try {
			console.log('🔍 Client: Sending plan change request:', {
				planName: selectedPlan.name,
				userId: 1,
				actionType: actionType
			});

			// Call the API to update the subscription in the database
			const response = await fetch('/api/subscription/update-plan', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					planName: selectedPlan.name,
					userId: 1, // TODO: Get actual user ID from auth context
					actionType: actionType
				}),
			});

			console.log('📦 Client: API response status:', response.status);
			console.log('📦 Client: API response headers:', Object.fromEntries(response.headers.entries()));

			const result = await response.json();
			console.log('📦 Client: API response body:', result);

			if (!response.ok) {
				throw new Error(`API Error: ${result.error || 'Unknown error'} - ${result.details || ''}`);
			}
			
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
			
			// Show success message
			setSuccessMessage(result.message || `Successfully ${actionType === 'upgrade' ? 'upgraded' : 'downgraded'} to ${selectedPlan.name} plan!`);
			setShowSuccessNotification(true);
			
			// Redirect after a short delay - stay on the plan page
			setTimeout(() => {
				router.push('/billing/plan');
			}, 1000);
			
		} catch (error) {
			console.error('❌ Client: Error updating plan:', error);
			setSuccessMessage(`Failed to update plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
			setShowSuccessNotification(true);
		} finally {
			setIsProcessing(false);
			setShowConfirmModal(false);
		}
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
		
		// If current plan is "No Active Plan", show it as current
		if (currentPlan?.name === "No Active Plan") {
			return allPlans.map(plan => ({
				...plan,
				isCurrent: false
			}));
		}
		
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
					className={`flex-1 p-10 max-w-7xl mx-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'}`}
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
								className={`px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 flex items-center gap-2 relative ${
									tab === "Personal"
										? isDarkMode 
											? "bg-pink-600 text-white shadow-lg shadow-pink-600/25" 
											: "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
										: isDarkMode
											? "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-300"
											: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
								}`}
								onClick={() => setTab("Personal")}
							>
								<HiOutlineUser className={`w-5 h-5 ${tab === "Personal" ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
								Personal
								{tab === "Personal" && (
									<motion.div
										layoutId="activeTab"
										className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${
											isDarkMode ? "bg-pink-400" : "bg-pink-300"
										}`}
									/>
								)}
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 flex items-center gap-2 relative ${
									tab === "Business"
										? isDarkMode 
											? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
											: "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
										: isDarkMode
											? "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-300"
											: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
								}`}
								onClick={() => setTab("Business")}
							>
								<HiOutlineBuildingOffice2 className={`w-5 h-5 ${tab === "Business" ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
								Business
								{tab === "Business" && (
									<motion.div
										layoutId="activeTab"
										className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${
											isDarkMode ? "bg-blue-400" : "bg-blue-300"
										}`}
									/>
								)}
							</motion.button>
						</motion.div>

						<motion.div 
							variants={itemVariants}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-wrap"
						>
							{/* Show canceled subscription status if no active plan */}
							{currentPlan?.name === "No Active Plan" && (
								<motion.div
									variants={cardVariants}
									className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl border border-gray-300 shadow-lg p-8 flex flex-col items-center relative min-w-[320px] max-w-[420px] ring-2 ring-red-200 dark:ring-red-600 transition-all duration-300`}
									style={{ flexBasis: "calc(33% - 1.5rem)" }}
								>
									<div className="text-xl font-bold mb-2 text-gray-500 flex items-center gap-2">
										{currentPlan.name}
										<div key="canceled-icon">
											<HiOutlineCheck className="w-5 h-5 text-red-500" />
										</div>
									</div>
									
									<div className={`text-sm mb-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
										{currentPlan.description}
									</div>
									
									<div className="text-4xl font-bold mb-2 text-gray-500 flex items-center gap-2">
										$0
										<span className="text-lg font-medium text-gray-500">/month</span>
									</div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className="flex items-center gap-1 text-red-600 text-sm mb-3"
									>
										<TrendingDown className="w-4 h-4" />
										Canceled
									</motion.div>

									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="mt-4 w-full py-3 rounded-lg font-semibold text-base transition-all bg-gray-500 text-white hover:bg-gray-600"
										onClick={() => {
											// Show a simple reactivation modal with plan options
											setShowReactivateModal(true);
										}}
									>
										Reactivate Plan
									</motion.button>

									<ul className="mt-6 w-full text-sm space-y-3">
										{currentPlan.features?.map((feature: string, i: number) => (
											<motion.li
												key={i}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.1 }}
												className="flex items-center gap-3"
											>
												<div className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
													<HiOutlineCheck className="w-4 h-4" />
												</div>
												<span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
													{feature}
												</span>
											</motion.li>
										))}
									</ul>
								</motion.div>
							)}

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
											{isCurrent && (
												<div key="current-check">
													<HiOutlineCheck className="w-5 h-5 text-green-500" />
												</div>
											)}
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
										disabled={isLoading}
										className={`px-6 py-2 rounded-lg font-medium ${isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
									>
										{isLoading ? (
											<div className="flex items-center space-x-2">
												<motion.div
													animate={{ rotate: 360 }}
													transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
													className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
												/>
												<span>Canceling...</span>
											</div>
										) : (
											'Cancel Subscription'
										)}
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Reactivate Subscription Modal */}
			<AnimatePresence>
				{showReactivateModal && (
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
								<h2 className="text-xl font-semibold">Reactivate Subscription</h2>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowReactivateModal(false)}
									className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
								>
									<HiXMark className="w-5 h-5" />
								</motion.button>
							</div>

							<div className="p-6">
								<p className={`mb-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
									Choose a plan to reactivate your subscription:
								</p>

								<div className="space-y-3">
									{plans.map((plan) => (
										<motion.div
											key={plan.name}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => {
												setSelectedPlan({
													...plan,
													button: 'Reactivate'
												});
												setShowReactivateModal(false);
												setShowConfirmModal(true);
											}}
											className={`p-4 rounded-lg border cursor-pointer transition-all ${
												isDarkMode 
													? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
													: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
											}`}
										>
											<div className="flex justify-between items-center">
												<div>
													<h3 className="font-semibold">{plan.name}</h3>
													<p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
														${plan.price}/month
													</p>
												</div>
												<div className={`text-lg font-bold ${plan.color}`}>
													${plan.price}
												</div>
											</div>
										</motion.div>
									))}
								</div>

								<div className="flex justify-end mt-6">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setShowReactivateModal(false)}
										className={`px-6 py-2 rounded-lg font-medium ${
											isDarkMode
												? 'bg-gray-700 text-white hover:bg-gray-600'
												: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
										}`}
									>
										Cancel
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
									{selectedPlan.button === 'Reactivate' ? 'Reactivate Subscription' : 
									 actionType === 'downgrade' ? 'Confirm Downgrade Subscription' : 'Confirm Upgrade Subscription'}
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
									{selectedPlan.button === 'Reactivate' ? 
										`You're about to reactivate your subscription to the ${selectedPlan.name} Plan` :
										`You're about to ${actionType === 'downgrade' ? 'downgrade' : 'upgrade'} to the ${selectedPlan.name} Plan`
									}
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
								<p className={`mb-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
									{selectedPlan.button === 'Reactivate' ? 
										'Your subscription will be reactivated immediately and you\'ll be charged for the new billing period.' :
										'Your new subscription will be activated immediately and you\'ll be charged a prorate amount for the current billing period.'
									}
								</p>
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
										onClick={selectedPlan.button === 'Reactivate' ? 
											() => handleReactivateSubscription(selectedPlan.name) : 
											handlePlanChange
										}
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
											selectedPlan.button === 'Reactivate' ? 'Reactivate Subscription' :
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