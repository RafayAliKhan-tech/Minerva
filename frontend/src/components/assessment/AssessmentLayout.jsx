// import Container from '../common/Container'
// import Button from '../common/Button'
// import { ChevronLeft } from 'lucide-react'

// function AssessmentLayout({
//   children,
//   showProgress = true,
//   currentStep = 1,
//   totalSteps = 1,
//   onBack,
//   title,
//   subtitle,
//   contentClassName = 'max-w-3xl',
// }) {
//   return (
//     <div className="min-h-screen bg-cream py-8 sm:py-12 lg:py-16">
//       <Container>
//         {/* Back button */}
//         {onBack && (
//           <div className="mb-8 flex items-center gap-2">
//             <button
//               onClick={onBack}
//               className="inline-flex items-center gap-2 text-sm font-medium text-brown-light transition-colors hover:text-brown"
//               aria-label="Go back"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Back
//             </button>
//           </div>
//         )}

//         {/* Progress bar */}
//         {showProgress && (
//           <div className="mb-8 space-y-2">
//             <div className="flex items-center justify-between">
//               <div className="text-xs font-semibold uppercase tracking-wider text-brown-light">
//                 Question {currentStep} of {totalSteps}
//               </div>
//               <span className="text-xs text-brown-light">
//                 {Math.round((currentStep / totalSteps) * 100)}%
//               </span>
//             </div>
//             <div className="h-1 w-full overflow-hidden rounded-full bg-brown/10">
//               <div
//                 className="h-full bg-gradient-to-r from-orange to-orange-light transition-all duration-500"
//                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//                 aria-valuenow={currentStep}
//                 aria-valuemin={1}
//                 aria-valuemax={totalSteps}
//                 role="progressbar"
//               />
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         {(title || subtitle) && (
//           <div className="mb-12 max-w-2xl">
//             {title && (
//               <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">
//                 {title}
//               </h1>
//             )}
//             {subtitle && (
//               <p className="mt-4 text-base leading-relaxed text-brown-light sm:text-lg">
//                 {subtitle}
//               </p>
//             )}
//           </div>
//         )}

//         {/* Main content */}
//         <div className={contentClassName}>{children}</div>
//       </Container>
//     </div>
//   )
// }

// export default AssessmentLayout
import Container from '../common/Container'
import Button from '../common/Button'
import { ChevronLeft } from 'lucide-react'

function AssessmentLayout({
  children,
  showProgress = true,
  currentStep = 1,
  totalSteps = 1,
  onBack,
  title,
  subtitle,
  contentClassName = 'max-w-3xl',
}) {
  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Back button */}
        {onBack && (
          <div className="mb-8 flex items-center gap-2">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-brown-light transition-colors hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </button>
          </div>
        )}

        {/* Progress bar */}
        {showProgress && (
          <div className="mb-10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-brown-light">
                Question {currentStep} of {totalSteps}
              </div>
              <span className="text-xs font-semibold text-brown">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-brown/10">
              <div
                className="h-full rounded-full bg-orange transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                role="progressbar"
              />
            </div>
          </div>
        )}

        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-12 max-w-2xl">
            {title && (
              <h1 className="font-serif text-3xl font-semibold leading-tight text-brown sm:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-brown-light sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Main content */}
        <div className={contentClassName}>{children}</div>
      </Container>
    </div>
  )
}

export default AssessmentLayout
