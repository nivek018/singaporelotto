import { Metadata } from 'next';
import { Shield, FileText, Cookie, Users, Globe, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PastDrawResults } from "@/components/PastDrawResults";

export const metadata: Metadata = {
    title: 'Privacy Policy | SG Lotto Results',
    description: 'Privacy Policy for SG Lotto Results. Learn how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300">
                        Last Updated: December 10, 2025
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section className="mb-10">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        At <strong>SG Lotto Results</strong>, accessible from <strong>sglottoresult.com</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SG Lotto Results and how we use it.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                    </p>
                </section>

                {/* Log Files */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Log Files</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        SG Lotto Results follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
                    </p>
                </section>

                {/* Cookies and Web Beacons */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                            <Cookie className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Cookies and Web Beacons</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Like any other website, SG Lotto Results uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
                    </p>
                </section>

                {/* Google DoubleClick DART Cookie */}
                <section className="mb-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Google DoubleClick DART Cookie</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to sglottoresult.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
                    </p>
                    <Link
                        href="https://policies.google.com/technologies/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                        https://policies.google.com/technologies/ads
                    </Link>
                </section>

                {/* Advertising Partners Privacy Policies */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Advertising Partners Privacy Policies</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        You may consult this list to find the Privacy Policy for each of the advertising partners of SG Lotto Results.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on SG Lotto Results, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        Note that SG Lotto Results has no access to or control over these cookies that are used by third-party advertisers.
                    </p>
                </section>

                {/* Third Party Privacy Policies */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Third Party Privacy Policies</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        SG Lotto Results&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
                    </p>
                </section>

                {/* Children's Information */}
                <section className="mb-10 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 md:p-8 border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Children&apos;s Information</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        SG Lotto Results does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                    </p>
                </section>

                {/* Online Privacy Policy Only */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Online Privacy Policy Only</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in SG Lotto Results. This policy is not applicable to any information collected offline or via channels other than this website.
                    </p>
                </section>

                {/* Consent */}
                <section className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Consent</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                    </p>
                </section>

                {/* Contact Us */}
                <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <a
                        href="mailto:kevs022@gmail.com"
                        className="inline-flex items-center gap-2 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        kevs022@gmail.com
                    </a>
                </section>
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
