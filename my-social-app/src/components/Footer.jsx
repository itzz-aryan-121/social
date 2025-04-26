import React from "react";
import { Link } from "react-router-dom";
import { FiTwitter, FiInstagram, FiGithub } from "react-icons/fi";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-amber-50 dark:bg-gray-900 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center">
              <Logo className="h-9 w-auto mr-3" />
              <span className="text-xl font-semibold text-amber-800 dark:text-amber-300 tracking-tight">
                RealEcho
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-md">
              A sanctuary for sharing stories of struggle, connecting hearts,
              and amplifying the echoes of resilience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-4">
                Community
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/groups"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Groups
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/personal"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Personal Stories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guidelines"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-amber-200 dark:border-gray-700" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href="https://twitter.com"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200"
              aria-label="Follow us on Twitter"
            >
              <FiTwitter className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200"
              aria-label="Follow us on Instagram"
            >
              <FiInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://github.com"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200"
              aria-label="View our GitHub"
            >
              <FiGithub className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} RealEcho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
