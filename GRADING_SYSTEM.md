# Grading & Evaluation System - Documentation

## Overview

The Assignment Manager now includes a comprehensive, transparent, and student-friendly grading system. This system allows teachers to evaluate assignments using multiple methods while providing students with clear visibility into their performance.

## Key Features

### 1. **Teacher Grading Interface**

Teachers can grade submissions using three flexible methods:

#### **Numeric Score (0-100)**
- Direct numeric input with automatic letter grade conversion
- Clear validation and instant feedback
- Perfect for straightforward assessments

#### **Letter Grade (A, B, C, D, F)**
- Quick grading with predefined grade levels
- Visual grade picker interface
- Automatic mapping: A (90+), B (80-89), C (70-79), D (60-69), F (<60)

#### **Rubric-Based Grading**
- Define custom criteria with weighted scores
- Each criterion has a name, weight percentage, and score
- Automatic total score calculation
- Collapsible UI to avoid clutter
- Supports assignment-level rubrics or custom per-submission rubrics

#### **Additional Features**
- **Comments**: Optional text feedback for detailed evaluation
- **Draft Mode**: Save grades without publishing to students
- **Finalize**: Publish grades to make them visible to students
- **Grade Status Badges**: Visual indicators (Not Graded, Draft, Final)

### 2. **Grade Status States**

Visual representation through subtle, professional badges:

- **Not Graded** (Gray): Assignment submitted but not yet evaluated
- **Graded (Draft)** (Amber): Grade saved but not visible to student
- **Graded (Final)** (Green): Grade published and visible to student

Students only see finalized grades, maintaining privacy during the evaluation process.

### 3. **Student Grade View**

Students see their grades in a calm, organized interface:

- **Letter Grade Badge**: Large, clear display of letter grade
- **Numeric Score**: Shows score out of 100
- **Rubric Breakdown**: Detailed view of how each criterion was scored
- **Teacher Feedback**: Comments from the teacher
- **Submission Info**: Date submitted and graded
- **Visibility Notice**: Clear messaging about grade availability

**Design Principles:**
- Uses calm success colors (green, indigo) instead of alarming reds
- Professional and unbiased presentation
- Clear separation between submission, feedback, and grades

### 4. **Grade Visibility & Transparency**

Built-in transparency features:

- **"Grades will be visible after teacher finalizes evaluation"** - Shows when grade is pending
- **Grade Publication Timestamp** - Displays when grade was published
- **Draft Protection** - Students cannot see draft grades
- **Status Indicators** - Clear visual cues about grading progress

### 5. **Grades Overview (Student Dashboard)**

A dedicated "Grades" tab in the student dashboard provides:

- **Summary Statistics**:
  - Total graded assignments
  - Average score percentage
  - Pending evaluations count

- **Graded Assignments List**:
  - Assignment title with link to details
  - Letter grade and numeric score
  - Submission and grading dates
  - Quick navigation to full grade details

- **Empty States**: Friendly messaging when no grades are available

### 6. **Grade Review Request System**

Allows students to request grade reconsideration:

#### **Student Side:**
- Request review with optional message
- View request status (Pending, Accepted, Declined)
- See teacher's response

#### **Teacher Side:**
- View all pending review requests
- Accept or decline with optional message
- Update grades if request is accepted

**Design:**
- Lightweight and optional
- Non-confrontational UI
- Encourages constructive dialogue

## Technical Implementation

### Type System

```typescript
export type GradeStatus = 'not-graded' | 'draft' | 'finalized';
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  score?: number;
}

export interface Grade {
  id: string;
  submissionId: string;
  teacherId: string;
  teacherName: string;
  numericScore?: number;
  letterGrade?: LetterGrade;
  rubricScores?: RubricCriterion[];
  totalScore?: number;
  comments?: string;
  status: GradeStatus;
  gradedAt?: string;
  publishedAt?: string;
}

export interface GradeReviewRequest {
  id: string;
  gradeId: string;
  studentId: string;
  studentName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  respondedAt?: string;
  responseMessage?: string;
}
```

### Components

#### **UI Components**
- `GradeStatusBadge` - Visual status indicators
- `LetterGradeBadge` - Large letter grade display
- `NumericScoreBadge` - Score display with color coding
- `GradeVisibilityNote` - Transparency messaging

#### **Feature Components**
- `GradingPanel` - Teacher grading interface
- `StudentGradeView` - Student grade display
- `GradesOverview` - Dashboard grades summary
- `GradeReviewRequestPanel` - Student review request
- `TeacherReviewRequestList` - Teacher review management

### Context Methods

```typescript
// Add or update grade
addGrade(submissionId, grade);
updateGrade(gradeId, updates);

// Publish draft grade
publishGrade(gradeId);

// Grade review requests
addGradeReviewRequest(request);
respondToReviewRequest(requestId, response);
```

## Usage Examples

### Teacher: Grading a Submission

1. Navigate to assignment detail page
2. View student submission
3. Scroll to "Grade Submission" panel
4. Choose grading method (Numeric/Letter/Rubric)
5. Enter score and optional comments
6. Click "Save as Draft" or "Publish Grade"

### Student: Viewing Grade

1. Navigate to assignment detail page
2. View grade card below submission
3. See letter grade, score, and feedback
4. Optionally request review if needed

### Student: Checking All Grades

1. Go to Dashboard
2. Click "Grades" tab
3. View summary statistics
4. Browse all graded assignments
5. Click on assignment to see full details

## UX Principles

✅ **Transparency**: Clear communication about grade status
✅ **Calm Design**: Professional colors, no alarming visuals  
✅ **Fairness**: Rubric-based grading for objectivity
✅ **Privacy**: Draft grades hidden from students
✅ **Efficiency**: Multiple grading methods for teacher convenience
✅ **Accessibility**: Clear labels, good contrast, semantic HTML

## Future Enhancements

Possible improvements:
- Grade analytics and trends
- Peer review integration
- Automated grading for objective questions
- Grade curves and distributions
- Export grades to CSV
- Weighted assignment categories
- Grade improvement tracking

## Notes

- All grades are stored in the AssignmentContext
- Mock data includes sample grades for testing
- Grade publication is timestamp-tracked
- Review requests are tied to specific grades
- Rubrics can be assignment-level or custom

---

**Built with transparency, fairness, and student success in mind.**
