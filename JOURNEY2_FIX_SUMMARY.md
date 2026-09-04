# Journey 2 Assessment - Questions Fetching Fix

## Problem Statement
Journey 2 was not fetching assessment questions for the selected career/domain. Users saw "Domain not found." error message when navigating to the assessment page.

## Root Causes Identified

### 1. **Critical Validation Bug** 🔴
**Location**: `src/auth/Journey2AssessmentContext.jsx` - `loadQuestions()` function

**Issue**: 
```javascript
// INCORRECT - fails if options array is empty
if (!question.options.length)
```

Questions might have an empty `options` array (valid for some question types), but the validation required the array to have at least one element.

**Fix**: Changed to check if options is an array type:
```javascript
// CORRECT - allows empty arrays
!Array.isArray(question.options)
```

---

### 2. **Error Display Priority Bug** 🔴
**Location**: `src/pages/DomainAssessment.jsx` - component render logic

**Issue**: When loading questions failed, the component would display generic "Domain not found." instead of the actual error message.

```javascript
// BEFORE - wrong order
if (!questions.length) {
  return <p>Domain not found.</p>
}

if (error || isLoading) {
  return <p>{error}</p>  // Never reached!
}
```

**Fix**: Reversed the checking order:
```javascript
// AFTER - correct order
if (error || isLoading) {
  return <p>{error}</p>  // Shows actual error first
}

if (!questions.length) {
  return <p>Domain not found.</p>
}
```

---

### 3. **Incomplete Response Structure Handling** 🟡
**Location**: `src/auth/Journey2AssessmentContext.jsx` - `unwrapList()` function

**Issue**: API might return questions nested in a `result` property, but the function didn't check for this structure.

**Fix**: Added support for additional response structures:
```javascript
if (Array.isArray(response?.result)) return response.result
if (Array.isArray(response?.result?.[key])) return response.result[key]
```

---

### 4. **Inconsistent Career Object Handling** 🟡
**Location**: `src/auth/Journey2AssessmentContext.jsx` - `loadQuestions()` function

**Issue**: Function was storing just the career ID string as `selectedCareer`, but the UI expected a full career object with properties like `career_name` or `careerName`.

**Fix**: Now finds and stores the full career object:
```javascript
const careerObj = careers.find((c) => (c.career_id || c.careerId || c.id) === career) || { id: career }
setSelectedCareer(careerObj)
```

---

### 5. **Insufficient Debugging Information** 🟡
**Locations**: Multiple files

**Fix**: Added comprehensive console logging:
- **minervaApi.js**: Logs which careerId is being requested and any fetch errors
- **Journey2AssessmentContext.jsx**: Logs raw response, normalized questions, validation failures, and detailed error info

These logs help developers quickly identify what's going wrong when issues occur.

---

## Files Modified

### 1. `src/auth/Journey2AssessmentContext.jsx`
- Enhanced `unwrapList()` to handle `result` property structures
- Fixed validation to use `Array.isArray()` check instead of `.length` check
- Separated validation into explicit steps with clear error messages
- Store full career object instead of just ID
- Added comprehensive error logging with HTTP details

### 2. `src/pages/DomainAssessment.jsx`
- Reversed error checking order (errors checked first)
- Ensures actual error messages are displayed to users

### 3. `src/api/minervaApi.js`
- Added pre-request logging for `getJourney2Questions()`
- Added error catch logging with error details

---

## Testing the Fix

### How to verify:
1. Navigate to "I Have a Domain in Mind" journey
2. Select a career (e.g., "ui_ux", "frontend")
3. You should see the assessment questions load
4. Check browser console (F12 > Console tab) for debug logs:
   - "Fetching Journey2 questions for careerId: [careerId]"
   - "Raw Journey2 questions response: [response object]"
   - "Normalized Journey2 questions: [array of questions]"

### API Endpoints:
```
GET  /api/journey2/GetJourney2Careers
GET  /api/journey2/GetJourney2Questions/{careerId}
POST /api/journey2/SubmitJourney2
GET  /api/journey2/GetJourney2Result/{careerId}
```

---

## Error Messages You May See

Now you'll see more informative error messages:
- ✅ "The Journey 2 API returned no questions for this career." - No questions in response
- ✅ "Invalid questions: X out of Y questions are missing required fields." - Data validation failed
- ✅ Network errors will show HTTP status and backend error message
- ✅ "Loading questions..." - Still loading data

Instead of the generic "Domain not found." for all failures.

---

## Browser Console Debug Output

You can now see detailed logs to diagnose issues:
```
Fetching Journey2 questions for careerId: ui_ux
Raw Journey2 questions response: {status: true, data: {...}}
Normalized Journey2 questions: [{id: "q1", title: "...", ...}, ...]
Questions count: 5
```

If there's an error:
```
Journey 2 loadQuestions error: Error: Invalid questions: 2 out of 5 questions are missing required fields.
Error details: {
  message: "Invalid questions...",
  response: {message: "...", error: "..."},
  status: 400
}
```

---

## Next Steps if Issues Persist

1. **Check browser console** (F12 > Console) for detailed logs
2. **Verify backend response** - The logs will show what the backend is actually returning
3. **Check API status** - Make sure the backend endpoints are responding
4. **Verify career IDs** - Ensure the career ID format matches what the backend expects (e.g., "ui_ux" vs "UI/UX")

The detailed logging should help pinpoint any remaining issues quickly.
