// src/app/layout.tsx
import "../styles/globals.css"; // đi ra khỏi app/ rồi vào styles/

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi">
            <body>{children}</body>
        </html>
    );
}
