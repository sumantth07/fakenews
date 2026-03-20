import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative px-6 md:px-12 lg:px-20 py-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Veritas</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Algorithmic truth verification powered by advanced machine learning.
            </p>
            <div className="flex gap-3">
              <button className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                <Github className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Product</div>
            <div className="space-y-3 text-sm text-zinc-500">
              <div className="hover:text-white cursor-pointer transition-colors">Features</div>
              <div className="hover:text-white cursor-pointer transition-colors">Pricing</div>
              <div className="hover:text-white cursor-pointer transition-colors">API Access</div>
              <div className="hover:text-white cursor-pointer transition-colors">Documentation</div>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Company</div>
            <div className="space-y-3 text-sm text-zinc-500">
              <div className="hover:text-white cursor-pointer transition-colors">About</div>
              <div className="hover:text-white cursor-pointer transition-colors">Blog</div>
              <div className="hover:text-white cursor-pointer transition-colors">Careers</div>
              <div className="hover:text-white cursor-pointer transition-colors">Contact</div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Legal</div>
            <div className="space-y-3 text-sm text-zinc-500">
              <div className="hover:text-white cursor-pointer transition-colors">Privacy</div>
              <div className="hover:text-white cursor-pointer transition-colors">Terms</div>
              <div className="hover:text-white cursor-pointer transition-colors">Security</div>
              <div className="hover:text-white cursor-pointer transition-colors">Compliance</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <div>© 2024 Veritas. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
