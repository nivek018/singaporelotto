import { Metadata } from 'next';
import { ScrollText, ShieldCheck, Ban, AlertCircle, Scale, Link2, RefreshCw, Gavel } from 'lucide-react';
import { PastDrawResults } from "@/components/PastDrawResults";

export const metadata: Metadata = {
    title: 'Terms of Service | SG Lotto Results',
    description: 'Terms of Service for SG Lotto Results. Read the rules and regulations for using our lottery results website.',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300">
                        Last Updated: December 10, 2025
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section className="mb-10">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Welcome to <strong>SG Lotto Results</strong>! These terms and conditions outline the rules and regulations for the use of our website, located at <strong>sglottoresult.com</strong>.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        By accessing this website, we assume you accept these terms and conditions. Do not continue to use SG Lotto Results if you do not agree to take all of the terms and conditions stated on this page.
                    </p>
                </section>

                {/* 1. Intellectual Property Rights */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Intellectual Property Rights</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                    Other than the content you own, under these Terms, SG Lotto Results and/or its licensors own all the intellectual property rights and materials contained in this Website. All official lottery names, logos, and draw data remain the property of their respective owners. We are a third-party informational service and claim no ownership over official lottery trademarks.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    You are granted limited license only for purposes of viewing the material contained on this Website.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Restrictions */}
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 md:p-8 border border-red-100 dark:border-red-800">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                                    <Ban className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Restrictions</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                    You are specifically restricted from all of the following:
                                </p>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        Publishing any Website material in any other media without credit.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        Selling, sublicensing, and/or otherwise commercializing any Website material.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        Using this Website in any way that is or may be damaging to this Website.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        Using this Website in any way that impacts user access to this Website.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        Engaging in any data mining, data harvesting, data extracting, or any other similar activity in relation to this Website.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. No Warranties */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. No Warranties</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    This Website is provided &quot;as is,&quot; with all faults, and SG Lotto Results expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Limitation of Liability */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Limitation of Liability</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    In no event shall SG Lotto Results, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. SG Lotto Results, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Third-Party Links */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Link2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Third-Party Links</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Our Service may contain links to third-party web sites or services (such as advertisements) that are not owned or controlled by SG Lotto Results. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Variation of Terms */}
                <section className="mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Variation of Terms</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    SG Lotto Results is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Governing Law & Jurisdiction */}
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-indigo-100 dark:border-indigo-800">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                                    <Gavel className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Governing Law & Jurisdiction</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    These Terms will be governed by and interpreted in accordance with the laws of the country where the website is operated, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Singapore for the resolution of any disputes.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Agreement Notice */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <ScrollText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
                        By continuing to use SG Lotto Results, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of this website.
                    </p>
                </section>
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
