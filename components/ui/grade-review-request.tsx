"use client";

import React, { useState } from "react";
import { GradeReviewRequest } from "@/app/context/AssignmentContext";
import { Card } from "./card";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Badge } from "./badge";
import { MessageCircle, Send, CheckCircle, XCircle, Clock } from "lucide-react";

interface GradeReviewRequestPanelProps {
  gradeId: string;
  studentId: string;
  studentName: string;
  existingRequest?: GradeReviewRequest;
  onSubmitRequest: (message: string) => void;
}

export function GradeReviewRequestPanel({
  gradeId,
  studentId,
  studentName,
  existingRequest,
  onSubmitRequest,
}: GradeReviewRequestPanelProps) {
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmitRequest(message);
      setMessage("");
      setShowForm(false);
    }
  };

  // If there's an existing request, show its status
  if (existingRequest) {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        label: "Pending Review",
      },
      accepted: {
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200",
        label: "Accepted",
      },
      declined: {
        icon: XCircle,
        color: "text-red-600 bg-red-50 border-red-200",
        label: "Declined",
      },
    };

    const config = statusConfig[existingRequest.status];
    const Icon = config.icon;

    return (
      <Card className={`p-4 border ${config.color}`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold">
                Grade Review Request
              </h4>
              <Badge className={config.color}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              {existingRequest.message}
            </p>
            <p className="text-xs text-gray-500">
              Submitted {new Date(existingRequest.createdAt).toLocaleDateString()}
            </p>
            {existingRequest.responseMessage && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Teacher Response:
                </p>
                <p className="text-sm text-gray-700">
                  {existingRequest.responseMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Show request form
  if (showForm) {
    return (
      <Card className="p-4 border-2 border-blue-100 bg-blue-50/30">
        <div className="mb-4">
          <Label htmlFor="reviewMessage" className="text-sm font-medium text-gray-700 mb-2 block">
            Request Grade Review
          </Label>
          <p className="text-xs text-gray-600 mb-3">
            Explain why you believe your grade should be reviewed
          </p>
          <Textarea
            id="reviewMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please review my grade because..."
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
          <Button
            onClick={() => {
              setShowForm(false);
              setMessage("");
            }}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  // Show button to open form
  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
    >
      <MessageCircle className="w-4 h-4 inline-block mr-2" />
      Request Grade Review
    </button>
  );
}

interface TeacherReviewRequestListProps {
  requests: GradeReviewRequest[];
  onRespond: (requestId: string, status: 'accepted' | 'declined', message?: string) => void;
}

export function TeacherReviewRequestList({
  requests,
  onRespond,
}: TeacherReviewRequestListProps) {
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  if (requests.length === 0) {
    return null;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  if (pendingRequests.length === 0) {
    return null;
  }

  const handleRespond = (requestId: string, status: 'accepted' | 'declined') => {
    onRespond(requestId, status, responseMessage || undefined);
    setRespondingTo(null);
    setResponseMessage("");
  };

  return (
    <Card className="p-4 border-2 border-amber-200 bg-amber-50/30">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-amber-600" />
        Grade Review Requests ({pendingRequests.length})
      </h4>
      <div className="space-y-3">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="p-3 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {request.studentName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                Pending
              </Badge>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {request.message}
            </p>

            {respondingTo === request.id ? (
              <div className="space-y-2">
                <Textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Optional response message..."
                  rows={2}
                  className="text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRespond(request.id, 'accepted')}
                    className="flex-1 text-sm bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRespond(request.id, 'declined')}
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Decline
                  </Button>
                  <Button
                    onClick={() => {
                      setRespondingTo(null);
                      setResponseMessage("");
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setRespondingTo(request.id)}
                variant="outline"
                className="w-full text-sm"
              >
                Respond
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
