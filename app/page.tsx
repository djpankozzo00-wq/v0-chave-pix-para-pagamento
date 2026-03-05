"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { HowItWorks } from "@/components/how-it-works"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { PurchaseModal } from "@/components/purchase-modal"

type SelectedPackage = {
  platform: string
  type: string
  quantity: string
  price: string
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null)

  const handleSelectPackage = (pkg: SelectedPackage) => {
    setSelectedPackage(pkg)
    setModalOpen(true)
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services onSelectPackage={handleSelectPackage} />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />

      <PurchaseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPackage={selectedPackage}
      />
    </>
  )
}
