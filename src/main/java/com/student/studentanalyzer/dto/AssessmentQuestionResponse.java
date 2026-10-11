package com.student.studentanalyzer.dto;

import com.student.studentanalyzer.entity.AssessmentQuestion;

public class AssessmentQuestionResponse {

    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    public AssessmentQuestionResponse() {
    }

    public AssessmentQuestionResponse(AssessmentQuestion question) {
        this.id = question.getId();
        this.questionText = question.getQuestionText();
        this.optionA = question.getOptionA();
        this.optionB = question.getOptionB();
        this.optionC = question.getOptionC();
        this.optionD = question.getOptionD();
    }

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public String getOptionD() {
        return optionD;
    }

}