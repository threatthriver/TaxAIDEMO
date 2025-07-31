export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">TaxAI</h2>
            <p className="text-sm mt-2 text-muted-foreground">Automated tax planning powered by AI.</p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Solutions</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">For Individuals</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">For Businesses</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">For Corporations</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Live Chat</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Expert Help</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            Disclaimer: TaxAI uses advanced language models to provide suggestions. This does not constitute financial, legal, or tax advice. All strategies should be reviewed by a qualified human professional.
          </p>
          <p className="text-sm mt-2">&copy; {new Date().getFullYear()} TaxAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
