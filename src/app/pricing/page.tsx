// filepath: /media/aly/home/brown-bag-med/src/app/pricing/page.tsx
import styles from '../page.module.css'
import Link from 'next/link'

const plans = [
	{
		name: 'Quick Check',
		price: '€59',
		features: [
			'✓ Basic medication list check',
			'✓ Up to 4 medications',
            '✓ PDF with general interactions or warnings',
            '👤 Ideal for patients taking up to 4 medications with or without chronic conditions',
            '⏱ Ready in 48–72 hours',
		],
		accent: styles.cardAccent1,
	},
	{
		name: 'In-Depth Analysis',
		price: '€99',
		features: [
			'✓ All of Quick Check',
            '✓ Comprehensive medication review',
            '✓ Up to 7 medications',
            '👤 Recommended for patients taking 5–7 medications or with known conditions like diabetes or hypertension',	 
			'⏱ Ready in 48–72 hours',
            
		],
		accent: styles.cardAccent2,
	},
	{
		name: 'Custom Consultation',
		price: '€149',
		features: [
			'✓ Comprehensive review of complex medication cases',
            '✓ 7+ medications',
            '✓ Personalized recommendations for patients with special needs',
            '👤 Ideal for patients taking 7+ medications or with rare conditions',
			'⏱ Ready in 24–48 hours',
		],
		accent: styles.cardAccent3,
	},
]

export default function PricingPage() {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 style={{ textAlign: 'center' }}>
						<a href="/" style={{ color: '#1e40af', textDecoration: 'none', fontSize: '3.25rem' }}>
							Brown Bag Med
						</a>
					</h1>
					<p style={{ textAlign: 'center', marginTop: '10px', color: '#1e40af', fontSize: '2.25rem', fontWeight: 'bold' }}>
						Pricing Plan
					</p>
				</div>
				<div className={styles.pricingGrid}>
					{plans.map((plan) => (
						<div key={plan.name} className={`${styles.card} ${plan.accent}`}>
							<h2 className={styles.cardTitle}>{plan.name}</h2>
							<div className={styles.cardPrice}>{plan.price}</div>
							<ul className={styles.cardFeatures}>
								{plan.features.map((item, i) => (
									<li
										key={i}
										className={
											item.startsWith('✓')
												? styles.cardCheck
												: item.startsWith('⏱')
													? styles.cardTime
													: undefined
										}
									>
										{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
					<Link href="/upload" className={styles.ctaButton}>
						Upload Your Medications &rarr;
					</Link>
				</div>
			</div>
		</div>
	)
}
