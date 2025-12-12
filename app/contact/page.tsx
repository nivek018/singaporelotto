import { Metadata } from 'next';
import { Mail, AlertTriangle, FileText, Handshake, Clock, Info, ShieldAlert, Ban, CheckCircle } from 'lucide-react';
import { PastDrawResults } from "@/components/PastDrawResults";

export const metadata: Metadata = {
    title: 'Contact Us | SG Lotto Results',
    description: 'Get in touch with SG Lotto Results. Contact us for questions, suggestions, error reports, or business inquiries.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto">
                        We appreciate your interest and value your feedback
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section className="mb-10">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Our goal is to provide accurate, timely, and helpful information to our visitors.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        If you have questions, suggestions, or would like to report an error on our website, please feel free to reach out.
                    </p>
                </section>

                {/* Email Us */}
                <section className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Email Us</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        You can contact our support team directly at:
                    </p>
                    <a
                        href="mailto:kevs022@gmail.com"
                        className="inline-flex items-center gap-2 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        kevs022@gmail.com
                    </a>
                </section>

                {/* Important Notice */}
                <section className="mb-10 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 md:p-8 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Important</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        To help us assist you as quickly as possible, please include the <strong>Website Name or URL</strong> you are inquiring about in the email subject line.
                    </p>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Example Subjects:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-amber-200 dark:border-amber-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">&quot;Advertising Inquiry for sglottoresult.com&quot;</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-amber-200 dark:border-amber-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">&quot;Report Error on Results Page&quot;</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-amber-200 dark:border-amber-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">&quot;General Question&quot;</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <p className="text-sm">We aim to respond to all inquiries within <strong>24–48 hours</strong>.</p>
                    </div>
                </section>

                {/* Please Note */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Please Note</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Before contacting us, please be aware of the following:
                    </p>

                    <div className="space-y-4">
                        {/* Informational Purpose Only */}
                        <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex-shrink-0">
                                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Informational Purpose Only</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    This website is an independent information service. We are not affiliated with any official lottery operators or government agencies.
                                </p>
                            </div>
                        </div>

                        {/* No Ticket Sales */}
                        <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex-shrink-0">
                                <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">No Ticket Sales</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    We do not sell lottery tickets, place bets, or facilitate online gambling. We cannot help you claim prizes or process winnings.
                                </p>
                            </div>
                        </div>

                        {/* Data Accuracy */}
                        <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex-shrink-0">
                                <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Data Accuracy</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    While we strive for 100% accuracy, official results should always be verified with the official lottery operator in your region.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Business & Advertising */}
                <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 md:p-8 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                            <Handshake className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Business & Advertising</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                        For advertising opportunities, partnerships, or media inquiries, please email us with the subject line <strong>&quot;Business Proposal&quot;</strong>.
                    </p>
                </section>
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
