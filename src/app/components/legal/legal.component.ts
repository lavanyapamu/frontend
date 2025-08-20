// legal.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-legal',
  imports:[CommonModule],
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {
  activeSection: string = 'terms';
  lastUpdated: string = 'December 15, 2024';
  currentYear: number = new Date().getFullYear();

  artistFaqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I get started selling on ArtFlare?',
      answer: `
        <p>Getting started is simple:</p>
        <ol>
          <li>Create your artist account with basic information</li>
          <li>Complete your profile with bio, portfolio, and verification documents</li>
          <li>Upload your first artwork with detailed descriptions and high-quality photos</li>
          <li>Set your pricing and shipping preferences</li>
          <li>Publish your listings and start connecting with buyers</li>
        </ol>
        <p>Our team reviews new artist applications within 24-48 hours.</p>
      `,
      isOpen: false
    },
    {
      id: 2,
      question: 'What are ArtFlare\'s commission rates and fees?',
      answer: `
        <p>ArtFlare charges an 8% service fee on successful sales, plus payment processing fees:</p>
        <ul>
          <li><strong>Service Fee:</strong> 8% of the artwork sale price</li>
          <li><strong>Payment Processing:</strong> 2.9% + ₹30 per transaction (varies by payment method)</li>
          <li><strong>No listing fees:</strong> It's free to list your artwork</li>
          <li><strong>No monthly fees:</strong> Only pay when you make sales</li>
        </ul>
        <p>Fees are automatically deducted from your earnings, and you receive the remaining amount within 3-5 business days.</p>
      `,
      isOpen: false
    },
    {
      id: 3,
      question: 'How do I price my artwork competitively?',
      answer: `
        <p>Consider these factors when pricing your work:</p>
        <ul>
          <li><strong>Materials cost:</strong> Include canvas, paints, brushes, and other supplies</li>
          <li><strong>Time investment:</strong> Factor in hours spent creating the piece</li>
          <li><strong>Your experience level:</strong> Established artists can command higher prices</li>
          <li><strong>Market research:</strong> Check similar artists' pricing on our platform</li>
          <li><strong>Size and complexity:</strong> Larger, more detailed works typically cost more</li>
        </ul>
        <p>Use our pricing calculator tool in your artist dashboard for personalized recommendations.</p>
      `,
      isOpen: false
    },
    {
      id: 4,
      question: 'What types of artwork can I sell on ArtFlare?',
      answer: `
        <p>We welcome a wide variety of artistic mediums:</p>
        <ul>
          <li><strong>Traditional Art:</strong> Paintings, drawings, sketches, mixed media</li>
          <li><strong>Digital Art:</strong> Digital paintings, illustrations, graphic designs</li>
          <li><strong>Photography:</strong> Fine art photography, limited edition prints</li>
          <li><strong>Sculptures:</strong> Clay, metal, wood, stone sculptures</li>
          <li><strong>Handicrafts:</strong> Pottery, jewelry, textiles, decorative items</li>
          <li><strong>Prints:</strong> Limited edition prints, art reproductions</li>
        </ul>
        <p>All artwork must be original or properly licensed. Mass-produced items and copyright violations are not permitted.</p>
      `,
      isOpen: false
    },
    {
      id: 5,
      question: 'How do I handle shipping and packaging?',
      answer: `
        <p>Artists are responsible for shipping their artwork safely:</p>
        <ul>
          <li><strong>Packaging:</strong> Use bubble wrap, cardboard, and sturdy boxes/tubes</li>
          <li><strong>Insurance:</strong> Consider insuring valuable pieces</li>
          <li><strong>Tracking:</strong> Always use shipping methods with tracking numbers</li>
          <li><strong>Communication:</strong> Keep buyers updated on shipping status</li>
        </ul>
        <p>We provide packaging guidelines and recommended shipping partners in your artist dashboard.</p>
      `,
      isOpen: false
    },
    {
      id: 6,
      question: 'How and when do I get paid?',
      answer: `
        <p>Payment processing is straightforward and secure:</p>
        <ul>
          <li><strong>Payment hold:</strong> Funds are held until buyer confirms receipt (max 14 days)</li>
          <li><strong>Automatic release:</strong> If no issues reported, payment auto-releases after 7 days</li>
          <li><strong>Transfer time:</strong> Funds transferred to your bank account within 3-5 business days</li>
          <li><strong>Payment methods:</strong> Bank transfer, UPI, or digital wallets</li>
        </ul>
        <p>Track all your earnings and payments in the artist dashboard.</p>
      `,
      isOpen: false
    },
    {
      id: 7,
      question: 'Can I sell commissioned artwork?',
      answer: `
        <p>Yes! Commissioned artwork is a great way to build relationships with collectors:</p>
        <ul>
          <li><strong>Custom orders:</strong> Enable commission requests in your profile</li>
          <li><strong>Pricing:</strong> Set your commission rates and deposit requirements</li>
          <li><strong>Timeline:</strong> Clearly communicate completion timeframes</li>
          <li><strong>Progress updates:</strong> Keep clients informed with work-in-progress photos</li>
          <li><strong>Approval process:</strong> Get final approval before shipping</li>
        </ul>
        <p>Our commission tools help manage the entire process from inquiry to delivery.</p>
      `,
      isOpen: false
    },
    {
      id: 8,
      question: 'How do I promote my artwork and increase sales?',
      answer: `
        <p>Maximize your visibility with these strategies:</p>
        <ul>
          <li><strong>Complete profile:</strong> Fill out all profile sections with high-quality photos</li>
          <li><strong>SEO optimization:</strong> Use relevant keywords in titles and descriptions</li>
          <li><strong>Social sharing:</strong> Share your ArtFlare listings on social media</li>
          <li><strong>Regular uploads:</strong> Add new pieces consistently to stay active</li>
          <li><strong>Engage with community:</strong> Participate in forums and comment on other artists' work</li>
          <li><strong>Featured listings:</strong> Consider our promotional packages for increased visibility</li>
        </ul>
      `,
      isOpen: false
    }
  ];

  buyerFaqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I purchase artwork on ArtFlare?',
      answer: `
        <p>Purchasing art is simple and secure:</p>
        <ol>
          <li>Browse our curated collection or search for specific styles</li>
          <li>Click on artwork you're interested in to view details</li>
          <li>Review artist information, artwork specifications, and policies</li>
          <li>Add to cart or contact the artist for questions</li>
          <li>Proceed to checkout with secure payment processing</li>
          <li>Receive confirmation and tracking information</li>
        </ol>
        <p>All payments are processed securely through Stripe and PayPal.</p>
      `,
      isOpen: false
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: `
        <p>We accept multiple secure payment methods:</p>
        <ul>
          <li><strong>Credit/Debit Cards:</strong> Visa, MasterCard, American Express</li>
          <li><strong>UPI:</strong> Google Pay, PhonePe, Paytm, and other UPI apps</li>
          <li><strong>Digital Wallets:</strong> PayPal, Amazon Pay</li>
          <li><strong>Net Banking:</strong> All major Indian banks</li>
          <li><strong>EMI Options:</strong> Available for purchases above ₹10,000</li>
        </ul>
        <p>All transactions are encrypted and PCI DSS compliant for maximum security.</p>
      `,
      isOpen: false
    },
    {
      id: 3,
      question: 'How can I track my order?',
      answer: `
        <p>Stay updated on your order status:</p>
        <ul>
          <li><strong>Order confirmation:</strong> Immediate email confirmation after purchase</li>
          <li><strong>Artist notification:</strong> Artist receives order within 1 hour</li>
          <li><strong>Shipping notification:</strong> Tracking details sent when item ships</li>
          <li><strong>Dashboard tracking:</strong> Real-time updates in your account dashboard</li>
          <li><strong>SMS updates:</strong> Optional text message notifications</li>
        </ul>
        <p>You can also message the artist directly through our platform for updates.</p>
      `,
      isOpen: false
    },
    {
      id: 4,
      question: 'What if I\'m not satisfied with my purchase?',
      answer: `
        <p>We want you to love your artwork. If there's an issue:</p>
        <ul>
          <li><strong>Contact first:</strong> Reach out to the artist within 14 days of delivery</li>
          <li><strong>Provide details:</strong> Describe the issue with photos if applicable</li>
          <li><strong>Resolution options:</strong> Replacement, partial refund, or full refund depending on the situation</li>
          <li><strong>Mediation support:</strong> Our team can help resolve disputes fairly</li>
        </ul>
        <p>Most issues are resolved quickly through direct communication with artists.</p>
      `,
      isOpen: false
    },
    {
      id: 5,
      question: 'Can I commission custom artwork?',
      answer: `
        <p>Absolutely! Many artists offer commission services:</p>
        <ul>
          <li><strong>Browse portfolios:</strong> Find artists whose style matches your vision</li>
          <li><strong>Send inquiry:</strong> Use the "Request Commission" button on artist profiles</li>
          <li><strong>Discuss details:</strong> Work with the artist on size, medium, timeline, and price</li>
          <li><strong>Secure deposit:</strong> Pay a deposit to begin work (typically 30-50%)</li>
          <li><strong>Progress updates:</strong> Receive photos and updates as work progresses</li>
          <li><strong>Final approval:</strong> Review completed work before final payment and shipping</li>
        </ul>
      `,
      isOpen: false
    },
    {
      id: 6,
      question: 'Are the artworks authentic and original?',
      answer: `
        <p>Yes, we maintain strict authenticity standards:</p>
        <ul>
          <li><strong>Artist verification:</strong> All artists undergo identity and portfolio verification</li>
          <li><strong>Originality guarantee:</strong> Artists certify their work is original or properly licensed</li>
          <li><strong>Certificate of authenticity:</strong> Provided with qualifying artwork purchases</li>
          <li><strong>Zero tolerance policy:</strong> Immediate removal of any copyright violations</li>
          <li><strong>Community reporting:</strong> Users can report suspected violations</li>
        </ul>
        <p>We stand behind the authenticity of all artwork sold on our platform.</p>
      `,
      isOpen: false
    },
    {
      id: 7,
      question: 'What are the shipping costs and delivery times?',
      answer: `
        <p>Shipping varies by artist location and artwork specifications:</p>
        <ul>
          <li><strong>Domestic shipping:</strong> ₹200-₹800 depending on size and distance</li>
          <li><strong>International shipping:</strong> ₹1,500-₹5,000 based on destination</li>
          <li><strong>Large artwork:</strong> Special handling fees may apply</li>
          <li><strong>Express options:</strong> Available for faster delivery at additional cost</li>
        </ul>
        <p>All shipping costs are clearly displayed during checkout before payment.</p>
      `,
      isOpen: false
    },
    {
      id: 8,
      question: 'Do you offer installation services for large artwork?',
      answer: `
        <p>For large pieces and sculptures, we can help arrange installation:</p>
        <ul>
          <li><strong>Partner network:</strong> Professional art handlers and installers in major cities</li>
          <li><strong>Consultation:</strong> Free assessment for installation requirements</li>
          <li><strong>Pricing:</strong> Installation costs quoted separately based on complexity</li>
          <li><strong>Insurance:</strong> All installation work is fully insured</li>
          <li><strong>Availability:</strong> Currently available in Mumbai, Delhi, Bangalore, and Hyderabad</li>
        </ul>
        <p>Contact us after purchase to arrange installation services.</p>
      `,
      isOpen: false
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check for URL parameters to set initial section
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    // Scroll to top of content area
    document.querySelector('.legal-content')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  getPolicyTitle(): string {
    const titles: { [key: string]: string } = {
      'terms': 'Terms & Conditions',
      'privacy': 'Privacy Policy',
      'shipping': 'Shipping Policy',
      'returns': 'Return Policy',
      'contact': 'Contact Us',
      'artist-faqs': 'Artist FAQs',
      'buyer-faqs': 'Buyer FAQs'
    };
    return titles[this.activeSection] || 'Legal Information';
  }

  toggleFaq(type: 'artist' | 'buyer', faqId: number): void {
    const faqArray = type === 'artist' ? this.artistFaqs : this.buyerFaqs;
    const faq = faqArray.find(f => f.id === faqId);
    if (faq) {
      faq.isOpen = !faq.isOpen;
      // Close other FAQs for cleaner UX (optional)
      // faqArray.forEach(f => {
      //   if (f.id !== faqId) f.isOpen = false;
      // });
    }
  }

  // Method to handle external links (if needed)
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Method to scroll to specific section within a policy
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Method to download policy as PDF (if implemented)
  downloadPolicy(): void {
    // Implementation would depend on your PDF generation service
    console.log('Download policy feature to be implemented');
  }

  // Method to print current policy
  printPolicy(): void {
    window.print();
  }
}