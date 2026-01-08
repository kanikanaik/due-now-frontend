# Grading System - Quick Component Reference

## Grading UI Components

### Grade Badges

#### `GradeStatusBadge`
Displays the current grading status.

```tsx
import { GradeStatusBadge } from "@/components/ui";

<GradeStatusBadge status="finalized" />
```

**Props:**
- `status: GradeStatus` - 'not-graded' | 'draft' | 'finalized'
- `className?: string` - Optional styling

---

#### `LetterGradeBadge`
Large, prominent letter grade display.

```tsx
<LetterGradeBadge grade="A" />
```

**Props:**
- `grade: LetterGrade` - 'A' | 'B' | 'C' | 'D' | 'F'
- `className?: string`

---

#### `NumericScoreBadge`
Displays numeric score with color coding.

```tsx
<NumericScoreBadge score={88} maxScore={100} />
```

**Props:**
- `score: number` - The achieved score
- `maxScore?: number` - Maximum possible (default: 100)
- `className?: string`

**Color coding:**
- 90-100: Green
- 80-89: Blue
- 70-79: Indigo
- 60-69: Amber
- <60: Gray

---

#### `GradeVisibilityNote`
Shows grade publication status.

```tsx
<GradeVisibilityNote 
  isVisible={true} 
  publishedAt="2024-12-31T10:00:00" 
/>
```

**Props:**
- `isVisible: boolean` - Whether grade is visible
- `publishedAt?: string` - Publication timestamp

---

## Feature Components

### `GradingPanel`
Complete teacher grading interface.

```tsx
import { GradingPanel } from "@/components/ui";

<GradingPanel
  submissionId={submission.id}
  teacherId={user.id}
  teacherName={user.name}
  existingGrade={submission.grade}
  assignmentRubric={assignment.rubric}
  onSaveGrade={handleSaveGrade}
  onPublishGrade={handlePublish}
/>
```

**Props:**
- `submissionId: string` - ID of the submission being graded
- `teacherId: string` - Teacher's ID
- `teacherName: string` - Teacher's name
- `existingGrade?: Grade` - Existing grade to edit
- `assignmentRubric?: RubricCriterion[]` - Rubric template
- `onSaveGrade: (grade) => void` - Save handler
- `onPublishGrade?: (gradeId) => void` - Publish handler

**Features:**
- Three grading methods (numeric, letter, rubric)
- Draft and finalize modes
- Optional comments
- Custom rubric support

---

### `StudentGradeView`
Student-facing grade display.

```tsx
<StudentGradeView
  grade={submission.grade}
  assignmentTitle={assignment.title}
  submittedAt={submission.submittedAt}
/>
```

**Props:**
- `grade?: Grade` - The grade object (only shows if finalized)
- `assignmentTitle: string` - Assignment name
- `submittedAt: string` - Submission timestamp

**Shows:**
- Letter grade and numeric score
- Rubric breakdown if applicable
- Teacher comments
- Submission and grading dates

---

### `GradesOverview`
Dashboard summary of all grades.

```tsx
<GradesOverview 
  assignments={assignments} 
  submissions={submissions} 
/>
```

**Props:**
- `assignments: Assignment[]` - All assignments
- `submissions: Submission[]` - Student's submissions

**Displays:**
- Graded count
- Average score
- Pending count
- List of graded assignments with links

---

### `GradeReviewRequestPanel`
Student interface for requesting grade review.

```tsx
<GradeReviewRequestPanel
  gradeId={grade.id}
  studentId={user.id}
  studentName={user.name}
  existingRequest={reviewRequest}
  onSubmitRequest={handleRequest}
/>
```

**Props:**
- `gradeId: string` - Grade ID
- `studentId: string` - Student ID
- `studentName: string` - Student name
- `existingRequest?: GradeReviewRequest` - Existing request
- `onSubmitRequest: (message) => void` - Submit handler

**States:**
- No request: Shows button to open form
- Request form: Text input and submit
- Pending/Responded: Shows status and response

---

### `TeacherReviewRequestList`
Teacher interface for managing review requests.

```tsx
<TeacherReviewRequestList
  requests={requests}
  onRespond={handleRespond}
/>
```

**Props:**
- `requests: GradeReviewRequest[]` - All review requests
- `onRespond: (requestId, status, message?) => void` - Response handler

**Features:**
- Lists pending requests
- Accept/decline actions
- Optional response message

---

## Context Methods

### Grading Methods

```typescript
// Add new grade
const { addGrade } = useAssignments();
addGrade(submissionId, {
  teacherId: "1",
  teacherName: "Dr. Johnson",
  numericScore: 85,
  letterGrade: "B",
  comments: "Good work!",
  status: "finalized"
});

// Update existing grade
const { updateGrade } = useAssignments();
updateGrade(gradeId, {
  numericScore: 90,
  comments: "Excellent improvement!"
});

// Publish draft grade
const { publishGrade } = useAssignments();
publishGrade(gradeId);
```

### Review Request Methods

```typescript
// Student submits review request
const { addGradeReviewRequest } = useAssignments();
addGradeReviewRequest({
  gradeId: "g1",
  studentId: "2",
  studentName: "Alex Chen",
  message: "I believe my analysis deserves a higher grade..."
});

// Teacher responds
const { respondToReviewRequest } = useAssignments();
respondToReviewRequest(requestId, {
  status: "accepted",
  message: "Good point, grade updated."
});
```

---

## Utility Functions

### Grade Conversion

```typescript
import { scoreToLetterGrade } from "@/lib/assignment-utils";

const letter = scoreToLetterGrade(88); // Returns "B"
```

### Grade Status Config

```typescript
import { getGradeStatusConfig } from "@/lib/assignment-utils";

const config = getGradeStatusConfig("finalized");
// { label: "Graded (Final)", className: "..." }
```

### Letter Grade Color

```typescript
import { getLetterGradeColor } from "@/lib/assignment-utils";

const color = getLetterGradeColor("A"); // Returns "text-green-600"
```

---

## Integration Examples

### Add Grading to Assignment Detail Page

```tsx
import { 
  GradingPanel, 
  StudentGradeView 
} from "@/components/ui";

// In component
const { 
  addGrade, 
  updateGrade 
} = useAssignments();

const handleSaveGrade = (grade) => {
  if (existingGrade) {
    updateGrade(existingGrade.id, grade);
  } else {
    addGrade(submissionId, grade);
  }
};

// In JSX - Teacher View
{user.role === "teacher" && (
  <GradingPanel
    submissionId={submission.id}
    teacherId={user.id}
    teacherName={user.name}
    existingGrade={submission.grade}
    onSaveGrade={handleSaveGrade}
  />
)}

// In JSX - Student View
{user.role === "student" && (
  <StudentGradeView
    grade={submission.grade}
    assignmentTitle={assignment.title}
    submittedAt={submission.submittedAt}
  />
)}
```

### Add Grades Tab to Dashboard

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, GradesOverview } from "@/components/ui";

<Tabs defaultValue="assignments">
  <TabsList>
    <TabsTrigger value="assignments">Assignments</TabsTrigger>
    <TabsTrigger value="grades">Grades</TabsTrigger>
  </TabsList>

  <TabsContent value="assignments">
    {/* Assignments list */}
  </TabsContent>

  <TabsContent value="grades">
    <GradesOverview 
      assignments={assignments} 
      submissions={submissions} 
    />
  </TabsContent>
</Tabs>
```

---

## Styling Guidelines

All grading components follow these design principles:

1. **Calm Colors**: Green and indigo for success, never alarming red
2. **Clear Hierarchy**: Visual separation of different information types
3. **Professional**: Clean borders, subtle gradients, proper spacing
4. **Transparent**: Clear messaging about status and visibility
5. **Accessible**: Good contrast ratios and semantic HTML

### Color Palette

- **Success/Finalized**: Green (bg-green-50, text-green-600, border-green-200)
- **Draft/Warning**: Amber (bg-amber-50, text-amber-600, border-amber-200)
- **Primary/Actions**: Indigo (bg-indigo-600, hover:bg-indigo-700)
- **Neutral**: Gray (bg-gray-50, text-gray-600, border-gray-200)

---

**For complete implementation details, see [GRADING_SYSTEM.md](./GRADING_SYSTEM.md)**
