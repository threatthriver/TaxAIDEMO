export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-6 py-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TaxAI. All rights reserved.</p>
        <p className="text-sm mt-4 max-w-3xl mx-auto">
          Disclaimer: TaxAI uses advanced language models to provide suggestions based on uploaded data. This does not constitute financial, legal, or tax advice. All generated strategies should be reviewed by a qualified human professional. We are not liable for any financial decisions made based on the AI-generated output.
        </p>
      </div>
    </footer>
  );
}
