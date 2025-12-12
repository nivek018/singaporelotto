import { Metadata } from 'next';
import { AlertTriangle, Building2, XCircle, Ban, UserCheck } from 'lucide-react';
import { PastDrawResults } from "@/components/PastDrawResults";

export const metadata: Metadata = {
    title: 'Disclaimer | SG Lotto Results',
    description: 'Disclaimer for SG Lotto Results. Important information about the use of our lottery results website.',
};

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Disclaimer</h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300">
                        Last Updated: December 10, 2025
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section className="mb-10">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        The information provided on <strong>SG Lotto Results</strong> is for general informational and entertainment purposes only. While we strive to ensure that the lottery results, draw schedules, and other data published on this site are accurate and timely, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information.
                    </p>
                </section>

                {/* 1. Not an Official Operator */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Not an Official Operator</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    SG Lotto Results is an independent service and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Singapore Pools or any government agencies. All product and company names are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. No Liability for Errors */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. No Liability for Errors</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    We do not guarantee the accuracy of the numbers and results posted. Users are strongly advised to verify all winning numbers with the official lottery organizer before discarding tickets or claiming prizes. SG Lotto Results assumes no liability for any errors, omissions, or inaccuracies in the content provided, nor for any loss or damage resulting from the use of this information.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. No Gambling Services */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Ban className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. No Gambling Services</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    We do not sell lottery tickets, facilitate bets, or handle money. This website is strictly for news and information reporting.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. User Responsibility */}
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 md:p-8 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. User Responsibility</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Any reliance you place on the information found on this website is strictly at your own risk. It is your responsibility to check official sources and comply with the laws and regulations of your jurisdiction regarding lottery and gambling.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Notice */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
                        By continuing to use SG Lotto Results, you acknowledge that you have read, understood, and agree to this disclaimer. If you do not agree with any part of this disclaimer, please discontinue use of this website immediately.
                    </p>
                </section>
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
