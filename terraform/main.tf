terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
}

module "vpc" {
  source      = "./modules/vpc"
  vpc_name    = "notesaver-k8s-cluster-vpc"
}

output "created_vpc_name" {
  description = "The name of the VPC created by the 'vpc' module."
  value       = module.vpc.vpc_name
}

output "created_vpc_id" {
  description = "The ID of the VPC created by the 'vpc' module."
  value       = module.vpc.vpc_id
}

output "created_public_subnet_id" {
  description = "The public subnet ID/s created by the 'vpc' module."
  value       = module.vpc.subnet_id
}
